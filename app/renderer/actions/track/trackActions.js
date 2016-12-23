import {normalize, arrayOf} from "normalizr";

import {SC} from "../../utils";
import {trackSchema} from "../../schemas";
import {actionTypes, OBJECT_TYPES, PLACEHOLDER_IMAGE, RELATED_PLAYLIST_SUFFIX}  from "../../constants"
import {setObject} from "../objectActions";
import {fetchComments} from "./";
import {addQueuedFunction} from "../";

const obj_type = OBJECT_TYPES.PLAYLISTS;

/**
 * Check if track exists and has comments and related tracks. If not fetch those.
 *
 * @param trackID
 * @returns {function(*, *)}
 */
export function fetchTrackIfNeeded(trackID) {
    return (dispatch, getState) => {
        const {entities, objects} = getState();
        const {track_entities} = entities;
        const playlists = objects[obj_type] || {};
        const comments = objects[OBJECT_TYPES.COMMENTS] || {};
        const current_playlist = String(trackID + RELATED_PLAYLIST_SUFFIX);

        if (!(trackID in track_entities)) {
            dispatch(fetchTrack(trackID));
        }

        if (!(current_playlist in playlists)) {
            dispatch(fetchRelated(trackID));
        }

        const comment = comments[trackID] || {};

        if (comments && !comment.isFetching && !comment.items) {
            dispatch(fetchComments(trackID));
        }

    }
}

/**
 * Fetch a track by id
 *
 * @param trackID Track to fetch
 * @returns {function(*)}
 */
function fetchTrack(trackID) {
    return dispatch => {

        fetch(SC.getTrackUrl(trackID))
            .then((response) => response.json())
            .then(json => {
                const n = normalize(json, trackSchema);

                dispatch(addTrack(n.entities));
            })
            .catch(err => {
                dispatch(addQueuedFunction(fetchTrack.bind(null, trackID), arguments))
            });
    }
}

/**
 * Fetch related tracks by track id
 *
 * @param trackID Track to fetch related tracks from
 * @returns {function(*)}
 */
function fetchRelated(trackID) {
    return dispatch => {
        fetch(SC.getRelatedUrl(trackID))
            .then(response => response.json())
            .then(json => {
                const n = normalize(json, arrayOf(trackSchema));
                n.result.unshift(parseInt(trackID));

                dispatch(setObject(trackID + RELATED_PLAYLIST_SUFFIX, obj_type, n.entities, n.result));
            })
            .catch(err => {
                dispatch(addQueuedFunction(fetchRelated.bind(null, trackID), arguments))
            });
    }
}

/**
 * Set track image to the placeholder image
 *
 * @param track_id Track to change image from
 * @returns {{type, entities: {track_entities: {}}}}
 */
export function updateTrackImage(track_id) {
    return {
        type: actionTypes.TRACK_UPDATE_IMAGE,
        entities: {
            track_entities: {
                [track_id]: {
                    artwork_url: PLACEHOLDER_IMAGE
                }
            }
        }
    }
}


/**
 * Add track and user entities to store
 *
 * @param entities
 * @returns {{type, entities: *}}
 */
function addTrack(entities) {
    return {
        type: actionTypes.TRACK_ADD,
        entities
    };
}
