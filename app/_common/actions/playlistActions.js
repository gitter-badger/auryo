import * as actionTypes from "../constants/actionTypes";
import * as SC from "../utils/soundcloudUtils";
import {playlistSchema, trackSchema, trackInfoSchema} from "../schemas";
import {arrayOf, normalize} from "normalizr";
import {PLAYLISTS, USER_PLAYLIST} from "../constants/playlist";
import {OBJECT_TYPES} from "../constants/global";
import {STREAM_CHECK_INTERVAL} from "../constants/config";
import {isFetching, setObject, setNewObjects} from "./objectActions";
import {addQueuedFunction} from "./app/offlineActions";
import _ from "lodash";

const obj_type = OBJECT_TYPES.PLAYLISTS;

let updaterInterval;


/**
 * Fetch and process user likes
 *
 * @returns {function(*)}
 */
export function fetchLikes() {
    return dispatch => {
        dispatch(isFetching("LIKES", obj_type));

        return fetch(SC.getLikesUrl())
            .then((response) => response.json())
            .then(json => { // Todo filter on non-streamable or not?
                const n = normalize(json, arrayOf(trackSchema));

                const result = _.reduce(n.result, (obj, t) => {
                    return Object.assign({}, obj, {[t]: 1})
                }, {});

                dispatch(setLikes(result));

                dispatch(setObject(
                    "LIKES",
                    obj_type,
                    n.entities,
                    n.result
                ));
            })
            .catch(err =>{
                dispatch(addQueuedFunction(fetchLikes,arguments));
            })
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
        return dispatch(fetchPlaylist(SC.getFeedUrl(), PLAYLISTS.STREAM));
    };
}
// TODO Generalize playlist
/**
 * Fetch playlist with name and url
 *
 * @param url
 * @param name
 * @returns {function(*)}
 * @private
 */
export function fetchPlaylist(url, name) {
    return dispatch => {

        dispatch(isFetching(name, obj_type));

        return fetch(url)
            .then(response => response.json())
            .then(json => {

                const collection = json.collection //Todo: Also show playlists in feed?
                    .filter(info => (info.track && info.track.kind === 'track') && info.track.streamable)
                    .map(info => {
                        info.info = {};

                        info.info.id = info.track.id;
                        info.info.from_user = info.user;
                        info.info.activity_type = info.type;

                        return info;
                    });

                const t = collection.map(info => info.track);
                const i = collection.map(info => info.info);

                const tracks = normalize(t, arrayOf(trackSchema));

                const info = normalize(_.uniqBy(i, 'id'), arrayOf(trackInfoSchema));

                function onlyUnique(value, index, self) {
                    return self.indexOf(value) === index;
                }

                dispatch(setObject(name, obj_type, {
                    track_entities: tracks.entities.track_entities,
                    feedInfo_entities: info.entities.feedInfo_entities,
                    user_entities: _.assign({}, tracks.entities.user_entities, info.entities.user_entities),
                }, info.result.filter(onlyUnique), json.next_href, json.future_href));

            })
            .catch(err => {
                dispatch(addQueuedFunction(fetchPlaylist.bind(null,url,name),arguments));
            });
    }
}

/**
 * Fetch stream and process new songs
 *
 * @param playlist
 * @param url - Future url from soundcloud API
 * @returns {function(*, *)}
 */
function updateFeed(playlist, url) {
    return (dispatch, getState) => {
        const {user, objects} = getState();
        const playlists = objects[obj_type] || {};

        const feed = playlists[PLAYLISTS.STREAM].items
            .reduce((obj, songId) => Object.assign({}, obj, {[songId]: 1}), {});

        const newSongs = user.newFeedItems
            .reduce((obj, songId) => Object.assign({}, obj, {[songId]: 1}), {});

        return fetch(url)
            .then(response => response.json())
            .then(json => {
                const collection = json.collection
                    .filter(song => song.kind === 'track' && !(song.id in feed) && !(song.id in newSongs) && song.streamable);

                const n = normalize(collection, arrayOf(trackInfoSchema));
                dispatch(setNewObjects(playlist, obj_type, json.future_href, n.entities, n.result));
            })
            .catch(err => {
                dispatch(addQueuedFunction(updateFeed.bind(null,playlist,url),arguments));
            });
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
            const {objects} = getState();
            const playlists = objects[obj_type] || {};
            const streamPlaylist = playlists[PLAYLISTS.STREAM];

            if (streamPlaylist.futureUrl) {
                dispatch(updateFeed(streamPlaylist, streamPlaylist.futureUrl));
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
    return dispatch => {
        return fetch(SC.getPlaylistUrl())
            .then(response => response.json())
            .then(json => {

                const n = normalize(json, arrayOf(playlistSchema));

                const result = _.reduce(n.result, (obj, t) => {
                    return Object.assign({}, obj, {[t]: 1})
                }, {});

                dispatch(setPlaylists(result, n.entities));

                n.result.forEach(playlistId => {
                    const playlist = n.entities.playlist_entities[playlistId];
                    dispatch(setObject(
                        playlist.title + USER_PLAYLIST,
                        obj_type,
                        {},
                        playlist.tracks,
                    ));
                });
            })
            .catch(err => {
                dispatch(addQueuedFunction(fetchPlaylists,arguments));
            });
    }

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

