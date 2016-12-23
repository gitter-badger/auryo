import {arrayOf, normalize} from "normalizr";
import _ from "lodash";

import {SC} from "../utils";
import {playlistSchema, trackSchema, trackInfoSchema} from "../schemas";
import {PLAYLISTS, USER_PLAYLIST_SUFFIX,actionTypes,OBJECT_TYPES} from "../constants";
import {STREAM_CHECK_INTERVAL} from "../../config";
import {setFetching, setObject, setNewObjects} from "./objectActions";
import {addQueuedFunction} from "./";

const obj_type = OBJECT_TYPES.PLAYLISTS;

let updaterInterval;


/**
 * Fetch and process user likes
 *
 * @returns {function(*)}
 */
export function fetchLikes() {
    const playlist = PLAYLISTS.LIKES;

    return dispatch => {
        dispatch(setFetching(playlist, obj_type,true));

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
                dispatch(setFetching(playlist, obj_type,false));
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
        type: actionTypes.AUTH_SET_LIKES,
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
        return dispatch(updatePlaylist(SC.getFeedUrl(), PLAYLISTS.STREAM));
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
export function updatePlaylist(url, name) {
    return dispatch => {

        dispatch(setFetching(name, obj_type,true));

        return fetch(url)
            .then(response => response.json())
            .then(json => {

                if(name == PLAYLISTS.STREAM){

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

                } else {
                    //Todo: Also show playlists in feed?
                    const collection = json.collection
                        .filter(track => (track.kind === 'track') && track.streamable);

                    const n = normalize(collection, arrayOf(trackSchema));

                    dispatch(setObject(name, obj_type, n.entities, n.result, json.next_href, json.future_href));
                }

            })
            .catch(err => {
                dispatch(setFetching(name, obj_type,false));
                dispatch(addQueuedFunction(updatePlaylist.bind(null,url,name),arguments));
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
        const {auth, objects} = getState();
        const playlists = objects[obj_type] || {};

        const feed = playlists[PLAYLISTS.STREAM].items
            .reduce((obj, songId) => Object.assign({}, obj, {[songId]: 1}), {});

        const newSongs = auth.newFeedItems
            .reduce((obj, songId) => Object.assign({}, obj, {[songId]: 1}), {});

        dispatch(setFetching(name, obj_type,false));
        return fetch(url)
            .then(response => response.json())
            .then(json => {
                const collection = json.collection
                    .filter(song => song.kind === 'track' && !(song.id in feed) && !(song.id in newSongs) && song.streamable);

                const n = normalize(collection, arrayOf(trackInfoSchema));
                dispatch(setNewObjects(playlist, obj_type, json.future_href, n.entities, n.result));
            })
            .catch(err => {
                dispatch(setFetching(name, obj_type,false));
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
                        playlist.title + USER_PLAYLIST_SUFFIX,
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
        type: actionTypes.AUTH_SET_PLAYLISTS,
        entities,
        playlists,
    };
}

