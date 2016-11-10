import * as actionTypes from "../constants/actionTypes";
import * as SC from "../utils/soundcloudUtils";
import {playlistSchema, trackSchema, trackInfoSchema} from "../schemas/";
import {PLAYLISTS, USER_PLAYLIST} from "../constants/playlist";
import {STREAM_CHECK_INTERVAL} from "../constants/Config";
import {arrayOf, normalize} from "normalizr";
import _ from "lodash";
let updaterInterval;


/**
 * Fetch and process user likes
 *
 * @returns {function(*)}
 */
export function fetchLikes() {
  return dispatch => {
    fetch(SC.getLikesUrl())
      .then((response) => response.json())
      .then(json => { // Todo filter on non-streamable or not?
        const n = normalize(json, arrayOf(trackSchema));

        const result = _.reduce(n.result, (obj, t) => {
          return Object.assign({}, obj, {[t]: 1})
        }, {});

        dispatch(setLikes(result));
        dispatch(setPlaylist(
          "LIKES",
          n.entities,
          n.result
        ));
      })
      .catch(err => {
        throw err;
      });
  }
}

/**
 * Save likes
 *
 * @param result
 * @returns {{type, likes: *}}
 */
function setLikes(result) {
  return {
    type: actionTypes.USER_SET_LIKES,
    result,
  };
}


/**
 * Fetch feed
 *
 * @returns {function(*)}
 */
export function fetchFeed() {
  return dispatch => {
    dispatch(initFeedUpdater());
    dispatch(_fetchPlaylist(SC.getFeedUrl(), PLAYLISTS.STREAM));
  };
}

/**
 * Fetch playlist with name and url
 *
 * @param url
 * @param name
 * @returns {function(*)}
 * @private
 */
function _fetchPlaylist(url, name) {
  return dispatch => {

    dispatch(isFetching(name));

    return fetch(url)
      .then(response => response.json())
      .then(json => {
        const nextUrl = (json.next_href) ? SC.appendToken(json.next_href) : null;
        const futureUrl = (json.future_href) ? SC.appendToken(json.future_href) : null;

        const collection = json.collection //Todo: Also show playlists in feed?
          .filter(info => (info.track && info.track.kind === 'track') && info.track.streamable)
          .map(info => {
            info.track.track_id = info.track.id;
            info.track.id = info.uuid;

            return info;
          });

        const tracks = collection.map(info => info.track);

        const n = normalize(tracks, arrayOf(trackSchema));
        console.log(n);

        const info = normalize(collection, arrayOf(trackInfoSchema));

        dispatch(setPlaylist(name, {
          tracks: n.entities.tracks,
          feedInfo: info.entities.feedInfo,
          users: _.assign({}, n.entities.users, info.entities.users),
        }, info.result, nextUrl, futureUrl));

      }).catch(err => {
        throw err;
      });
  }
}

/**
 * set playlist isfetching property
 *
 * @param name
 * @returns {{type, name: *}}
 */
function isFetching(name) {
  return {
    type: actionTypes.PLAYLIST_IS_FETCHING,
    name
  };
}

/**
 * Save playlist
 *
 * @param name
 * @param entities
 * @param result
 * @param nextUrl
 * @param futureUrl
 * @returns {{type: *, name: *, entities: *, result: *, nextUrl: *, futureUrl: *}}
 */
function setPlaylist(name, entities, result, nextUrl = null, futureUrl = null) {
  return {
    type: actionTypes.PLAYLIST_SET,
    name,
    entities,
    result,
    nextUrl,
    futureUrl
  };
}

/**
 * Fetch stream and process new songs
 *
 * @param url - Future url from soundcloud API
 * @returns {function(*, *)}
 */
function updateFeed(url) {
  return (dispatch, getState) => {
    const {user, playlists} = getState();

    const feed = playlists[PLAYLISTS.STREAM].items
      .reduce((obj, songId) => Object.assign({}, obj, {[songId]: 1}), {});

    const newSongs = user.newFeedItems
      .reduce((obj, songId) => Object.assign({}, obj, {[songId]: 1}), {});

    return fetch(url)
      .then(response => response.json())
      .then(json => {
        const futureUrl = (json.future_href) ? SC.appendToken(json.future_href) : null;
        const collection = json.collection
          .filter(song => song.kind === 'track' && !(song.id in feed) && !(song.id in newSongs) && song.streamable);

        const n = normalize(collection, arrayOf(trackInfoSchema));
        dispatch(setNewFeedItems(futureUrl, n.entities, n.result));
      })
      .catch(err => {
        throw err;
      });
  };
}

/**
 * Save new feed items
 *
 * @param futureUrl
 * @param entities
 * @param result
 * @returns {{type, entities: *, result: *, futureUrl: *}}
 */
function setNewFeedItems(futureUrl, entities, result) {
  return {
    type: actionTypes.USER_SET_NEW_FEED_ITEMS,
    entities,
    result,
    futureUrl
  };
}

/**
 * Check for new stream songs every x milliseconds
 *
 * @returns {function(*, *)}
 */
function initFeedUpdater() {
  return (dispatch, getState) => {
    updaterInterval = setInterval(() => {
      const {playlists} = getState();
      const streamPlaylist = playlists[PLAYLISTS.STREAM];

      if (streamPlaylist.futureUrl) {
        dispatch(updateFeed(streamPlaylist.futureUrl));
      } else {
        clearInterval(updaterInterval);
      }

    }, STREAM_CHECK_INTERVAL);
  };
}


/**
 * Fetch and process user playlists
 *
 * @returns {function(*)}
 */
export function fetchPlaylists() {
  return dispatch =>
    fetch(SC.getPlaylistUrl())
      .then(response => response.json())
      .then(json => {

        const n = normalize(json, arrayOf(playlistSchema));

        const result = _.reduce(n.result, (obj, t) => {
          return Object.assign({}, obj, {[t]: 1})
        }, {});

        dispatch(setPlaylists(result, n.entities));

        n.result.forEach(playlistId => {
          const playlist = n.entities.playlists[playlistId];
          dispatch(setPlaylist(
            playlist.title + USER_PLAYLIST,
            {},
            playlist.tracks,
          ));
        });
      })
      .catch(err => {
        throw err;
      });
}

/**
 *
 * @param playlists
 * @param entities
 * @returns {{type: *, entities: *, playlists: *}}
 */
function setPlaylists(playlists, entities) {
  return {
    type: actionTypes.USER_SET_PLAYLISTS,
    entities,
    playlists,
  };
}

export function fetchMore(playlist) {
  return (dispatch, getState) => {
    const {playlists} = getState();
    if (canFetchMore(playlists, playlist)) {
      const nextUrl = playlists[playlist].nextUrl;
      return dispatch(_fetchPlaylist(nextUrl, playlist));
    }

    return null;
  };
}
function canFetchMore(playlists, playlist) {
  const current = playlists[playlist];

  return current && (current.nextUrl !== null) && !current.isFetching;

}
