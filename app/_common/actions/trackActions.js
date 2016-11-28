import * as SC from "../utils/soundcloudUtils";
import {trackSchema} from "../schemas";
import {normalize, arrayOf} from "normalizr";
import * as actionTypes from "../constants/actionTypes";
import {OBJECT_TYPES, PLACEHOLDER_IMAGE} from "../constants/global";
import {setObject} from "./objectActions";
import {RELATED_PLAYLIST} from "../constants/playlist";
import {fetchComments} from "./commentActions";
import {addQueuedFunction} from "./offlineActions";

const obj_type = OBJECT_TYPES.PLAYLISTS;

export function fetchTrackIfNeeded(trackID) {
    return (dispatch, getState) => {
        const {entities, objects} = getState();
        const {track_entities} = entities;
        const playlists = objects[obj_type] || {};
        const current_playlist = String(trackID + RELATED_PLAYLIST);

        if (!(trackID in track_entities)) {
            dispatch(fetchTrack(trackID));
        } else {
            if (!(current_playlist in playlists)) {
                dispatch(fetchRelated(trackID));
            }

            if (!("comments" in track_entities[trackID])) {
                dispatch(fetchComments(trackID));
            }
        }

    }
}

function fetchTrack(trackID) {
    return dispatch => {

        fetch(SC.getTrackUrl(trackID))
            .then((response) => response.json())
            .then(json => {
                const n = normalize(json, trackSchema);

                dispatch(fetchSongData(trackID, n.entities));
            })
            .catch(err => {
                dispatch(addQueuedFunction(fetchTrack.bind(null, trackID),arguments))
            });
    }
}

function fetchSongData(trackID, entities) {
    return dispatch => {
        dispatch(addSong(entities));
        dispatch(fetchRelated(trackID));
        dispatch(fetchComments(trackID));
    }
}

function fetchRelated(trackID) {
    return dispatch => {
        fetch(SC.getRelatedUrl(trackID))
            .then(response => response.json())
            .then(json => {
                const n = normalize(json, arrayOf(trackSchema));
                n.result.unshift(parseInt(trackID));

                dispatch(setObject(trackID + RELATED_PLAYLIST, obj_type, n.entities, n.result));
            })
            .catch(err => {
                dispatch(addQueuedFunction(fetchRelated.bind(null, trackID),arguments))
            });
    }
}

export function toggleLike(trackID) {
    return (dispatch, getState) => {
        const {user} = getState();
        const {likes} = user;

        const liked = (trackID in likes) && likes[trackID] == 1;

        if (!(trackID in likes)) {
            dispatch(addLike(trackID));
        } else {
            dispatch(setLike(trackID, (!liked == false) ? 0 : 1));
        }

        dispatch(updateLike(trackID, !liked));

    }
}

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

function updateLike(trackID, liked) {
    return dispatch => {
        fetch(SC.updateLikeUrl(trackID), {
            method: (liked == 1) ? "PUT" : "DELETE"
        }).catch(err => {
            dispatch(addQueuedFunction(updateLike.bind(null, trackID, liked),arguments))
        })
    }
}

function setLike(trackID, liked) {
    return {
        type: actionTypes.USER_SET_LIKE,
        trackID,
        liked
    }
}

function addLike(trackID) {
    return {
        type: actionTypes.USER_ADD_LIKE,
        trackID
    }
}


function addSong(entities) {
    return {
        type: actionTypes.TRACK_ADD,
        entities
    };
}
