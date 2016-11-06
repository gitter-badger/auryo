import * as SC from "../utils/soundcloud";
import {arrayOf, normalize} from "normalizr";
import * as actionTypes from "../constants/actionTypes";
import trackSchema from "../schemas/track";
import trackInfoSchema from "../schemas/trackInfo";
import userSchema from "../schemas/user";
import playlistSchema from "../schemas/playlist";
import {merge} from "lodash";
import {PLAYLISTS, USER_PLAYLIST} from "../constants/playlist";
import {remote} from "electron";
import {STREAM_CHECK_INTERVAL} from "../constants/Config";
var config = remote.require('./utils/config');

let streamInterval;

/**
 * Get token from config and initialize Soundcloud class
 *
 * @returns {function(*)}
 */
export function initAuth() {
    return dispatch => {
        config.get('access_token', function (err, token) {

            if (err)
                throw err;

            if (!token)
                throw new Error('Refusing to initialize application, authentication token not found.');

            if (token) {
                SC.initialize(token);
                dispatch(fetchUser());
            }

            return null;

        });
    }
}

export function fetchUser() {
    return dispatch => {
        dispatch(fetchMe());
        dispatch(fetchLikes());
        dispatch(fetchStream());
        dispatch(fetchPlaylists());
        dispatch(fetchFollowings());
    };
}

export function fetchSongsIfNeeded(playlist) {
    return (dispatch, getState) => {
        const {playlists} = getState();
        if (shouldFetchSongs(playlists, playlist)) {
            const nextUrl = playlists[playlist].nextUrl;
            return dispatch(fetchSongs(nextUrl, playlist));
        }

        return null;
    };
}

function shouldFetchSongs(playlists, playlist) {
    const activePlaylist = playlists[playlist];
    if (activePlaylist && (activePlaylist.nextUrl !== null) && !activePlaylist.isFetching) {
        return true;
    }

    return false;
}

/**
 * Fetch user data
 *
 * @returns {function(*)}
 */
function fetchMe() {
    return dispatch => {
        fetch(SC.getMeUrl())
            .then((response) => response.json())
            .then((data) => {
                dispatch(recieveUser(data));
            });
    }
}

/**
 * Fetch stream
 *
 * @returns {function(*)}
 */
function fetchStream() {
    return dispatch => {
        dispatch(initInterval());
        dispatch(fetchSongs(SC.getFeedUrl(), PLAYLISTS.STREAM));
    };
}

/**
 * Fetch stream and process new songs
 *
 * @param url - Future url from soundcloud API
 * @returns {function(*, *)}
 */
function fetchNewStreamSongs(url) {
    return (dispatch, getState) => {
        const {auth, playlists} = getState();
        const streamSongsMap = playlists[PLAYLISTS.STREAM].items
            .reduce((obj, songId) => Object.assign({}, obj, {[songId]: 1}), {});
        const newStreamSongsMap = auth.newStreamSongs
            .reduce((obj, songId) => Object.assign({}, obj, {[songId]: 1}), {});

        return fetch(url)
            .then(response => response.json())
            .then(json => {
                const collection = json.collection
                    .filter(song => song.kind === 'track'
                    && song.streamable
                    && !(song.id in streamSongsMap)
                    && !(song.id in newStreamSongsMap));
                return {futureUrl: SC.appendToken(json.future_href), collection};
            })
            .then(data => {
                const normalized = normalize(data.collection, arrayOf(trackInfoSchema));
                dispatch(receiveNewStreamSongs(data.futureUrl, normalized.entities, normalized.result));
            })
            .catch(err => {
                throw err;
            });
    };
}

/**
 * Fetch from url and process playlist
 *
 * @param url
 * @param playlist
 * @returns {function(*)}
 */
export function fetchSongs(url, playlist) {
    return dispatch=> {
        dispatch(requestSongs(playlist));

        return fetch(url)
            .then(response => response.json())
            .then(json => {
                let nextUrl = null;
                let futureUrl = null;
                if (json.next_href) {
                    nextUrl = SC.appendToken(json.next_href);
                }

                if (json.future_href) {
                    futureUrl = SC.appendToken(json.future_href);
                }
                const collection = json.collection
                    .map(song => {
                        var track = song.track;
                        if(track){
                            track.from = song.user;
                            track.activity_type = song.type;

                            return track;
                        }

                        return null;

                    })
                    .filter(track => (track && track.kind === 'track') && track.streamable);

                const normalized = normalize(collection, arrayOf(trackInfoSchema));

                dispatch(recievePlaylist({
                    tracks: normalized.entities.track_info,
                    users: normalized.entities.users,
                }, normalized.result, playlist, nextUrl, futureUrl));

            }).catch(err => {
                throw err;
            });
    };
}

/**
 * Check for new stream songs every x milliseconds
 *
 * @returns {function(*, *)}
 */
function initInterval() {
    return (dispatch, getState) => {
        streamInterval = setInterval(() => {
            const {playlists} = getState();
            const streamPlaylist = playlists[PLAYLISTS.STREAM];

            if (streamPlaylist.futureUrl) {
                dispatch(fetchNewStreamSongs(streamPlaylist.futureUrl));
            } else {
                clearInterval(streamInterval);
            }
        }, STREAM_CHECK_INTERVAL);
    };
}

/**
 * Fetch and process user likes
 *
 * @returns {function(*)}
 */
function fetchLikes() {
    return dispatch => {
        fetch(SC.getLikesUrl())
            .then((response) => response.json())
            .then(json => {
                const collection = json;
                //.filter(song => song.streamable); Todo show non-streamable or not?
                const normalized = normalize(collection, arrayOf(trackSchema));
                const likes = normalized.result
                    .reduce((obj, songId) => Object.assign({}, obj, {[songId]: 1}), {});
                dispatch(receiveLikes(likes));
                dispatch(recievePlaylist(
                    normalized.entities,
                    normalized.result,
                    "LIKES"
                ));
            })
            .catch(err => {
                throw err;
            });
    }
}

/**
 * Fetch and process user playlists
 *
 * @returns {function(*)}
 */
function fetchPlaylists() {
    return dispatch =>
        fetch(SC.getPlaylistUrl())
            .then(response => response.json())
            .then(json => {

                const normalized = normalize(json, arrayOf(playlistSchema));
                dispatch(receivePlaylists(normalized.result, normalized.entities));

                normalized.result.forEach(playlistId => {
                    const playlist = normalized.entities.playlists[playlistId];
                    dispatch(recievePlaylist(
                        {},
                        playlist.tracks,
                        playlist.title + USER_PLAYLIST
                    ));
                });
            })
            .catch(err => {
                throw err;
            });
}

function receivePlaylists(playlists, entities) {
    return {
        type: actionTypes.RECEIVE_PLAYLISTS,
        entities,
        playlists,
    };
}

/**
 * Fetch and process user followings
 *
 * @returns {function(*)}
 */
function fetchFollowings() {
    return dispatch =>
        fetch(SC.getFollowingsUrl())
            .then(response => response.json())
            .then(json => {
                const normalized = normalize(json.collection, arrayOf(userSchema));
                const users = normalized.result
                    .reduce((obj, userId) => Object.assign({}, obj, {[userId]: 1}), {});

                dispatch(recieveFollowings(users, normalized.entities));
            })
            .catch(err => {
                throw err;
            });
}

/**
 * Let the system know we are fetching songs
 *
 * @param playlist
 * @returns {{type, playlist: *}}
 */
function requestSongs(playlist) {
    return {
        type: actionTypes.REQUEST_SONGS,
        playlist
    };
}

/**
 * Save user
 *
 * @param user
 * @returns {{type, user: *}}
 */
function recieveUser(user) {
    return {
        type: actionTypes.RECEIVE_USER,
        user
    };
}

/**
 * Save likes
 *
 * @param likes
 * @returns {{type, likes: *}}
 */
function receiveLikes(likes) {
    return {
        type: actionTypes.RECEIVE_LIKES,
        likes,
    };
}
/**
 * Save user followings
 *
 * @param users
 * @param entities
 * @returns {{type: *, entities: *, users: *}}
 */
function recieveFollowings(users, entities) {
    return {
        type: actionTypes.RECEIVE_FOLLOWINGS,
        entities,
        users,
    };
}

/**
 * Save playlist
 *
 * @param entities
 * @param songs
 * @param playlist
 * @param nextUrl
 * @param futureUrl
 * @returns {{type, entities: *, futureUrl: *, nextUrl: *, playlist: *, songs: *}}
 */
function recievePlaylist(entities, songs, playlist, nextUrl, futureUrl) {
    return {
        type: actionTypes.RECEIVE_PLAYLIST,
        entities,
        futureUrl,
        nextUrl,
        playlist,
        songs,
    };
}

/**
 * Save new stream songs
 *
 * @param futureUrl
 * @param entities
 * @param songs
 * @returns {{type, entities: *, futureUrl: *, songs: *}}
 */
function receiveNewStreamSongs(futureUrl, entities, songs) {
    return {
        type: actionTypes.RECEIVE_NEW_STREAM_SONGS,
        entities,
        futureUrl,
        songs,
    };
}