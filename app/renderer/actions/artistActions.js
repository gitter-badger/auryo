import {normalize, arrayOf} from "normalizr";

import {SC} from "../utils"
import {setObject, setFetching} from "./objectActions"
import {actionTypes, OBJECT_TYPES, USER_TRACKS_PLAYLIST_SUFFIX, USER_LIKES_SUFFIX}  from "../constants"
import {trackSchema} from "../schemas";

const obj_type = OBJECT_TYPES.PLAYLISTS;

/**
 * Fetch user if limited info is available. Also check if user tracks or likes have been fetched.
 *
 * @param artistID
 * @returns {function(*, *)}
 */
export function fetchArtistIfNeeded(artistID) {
    return (dispatch, getState) => {
        const {entities, objects} = getState();
        const {user_entities} = entities;
        const playlists = objects[obj_type];


        if (!(artistID in user_entities) || !user_entities[artistID].followers_count) {
            dispatch(fetchUser(artistID));
        }

        const tracks_playlist = artistID + USER_TRACKS_PLAYLIST_SUFFIX;

        if (playlists && !playlists[tracks_playlist]) {
            dispatch(fetchUserTracks(artistID));
        }
        const likes_playlist = artistID + USER_LIKES_SUFFIX;

        if (playlists && !playlists[likes_playlist]) {
            dispatch(fetchUserLikes(artistID));
        }

    }
}

/**
 * Fetch user info
 *
 * @param artistsID
 * @returns {function(*)}
 */
function fetchUser(artistsID) {
    return dispatch => {
        fetch(SC.getUserUrl(artistsID))
            .then(response => response.json())
            .then(json => dispatch(setUser(json)));
    }
}

/**
 * Set user entity
 *
 * @param user
 * @returns {{type, entities: {user_entities: {}}}}
 */
function setUser(user) {
    return {
        type: actionTypes.USER_SET,
        entities: {
            user_entities: {
                [user.id]: user
            }
        }
    }
}

/**
 * Get user owned tracks
 *
 * @param artistID
 * @returns {function(*)}
 */
function fetchUserTracks(artistID) {
    const playlist = artistID + USER_TRACKS_PLAYLIST_SUFFIX;

    return dispatch => {
        dispatch(setFetching(playlist, obj_type, true));

        fetch(SC.getUserTracksUrl(artistID))
            .then(response => response.json())
            .then(json => {
                const collection = json.collection
                    .filter(track => (track.kind === 'track') && track.streamable);

                const n = normalize(collection, arrayOf(trackSchema));

                dispatch(setObject(playlist, obj_type, n.entities, n.result, json.next_href, json.future_href));
            });
    }
}

/**
 * Get user owned likes
 *
 * @param artistID
 * @returns {function(*)}
 */
function fetchUserLikes(artistID) {
    const playlist = artistID + USER_LIKES_SUFFIX;

    return dispatch => {
        dispatch(setFetching(playlist, obj_type, true));

        fetch(SC.getUserLikesUrl(artistID))
            .then(response => response.json())
            .then(json => {
                const collection = json.collection
                    .filter(track => (track.kind === 'track') && track.streamable);

                const n = normalize(collection, arrayOf(trackSchema));

                dispatch(setObject(playlist, obj_type, n.entities, n.result, json.next_href, json.future_href));
            });
    }
}