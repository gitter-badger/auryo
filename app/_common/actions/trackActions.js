import * as SC from "../utils/soundcloudUtils";
import {trackSchema} from "../schemas";
import {normalize, arrayOf} from "normalizr";
import * as actionTypes from "../constants/actionTypes";
import {OBJECT_TYPES} from "../constants/global";
import {setObject} from "./objectActions";
import {RELATED_PLAYLIST} from "../constants/playlist";
import {fetchComments} from "./commentActions";

const obj_type = OBJECT_TYPES.PLAYLISTS;

export function fetchTrackIfNeeded(trackID) {
    return (dispatch, getState) => {
        const {entities, objects} = getState();
        const {tracks} = entities;
        const playlists = objects[obj_type] || {};
        const current_playlist = String(trackID + RELATED_PLAYLIST);

        if (!(trackID in tracks)) {
            dispatch(fetchTrack(trackID));
        } else {
            if (!(current_playlist in playlists)) {
                dispatch(fetchRelated(trackID));
            }

            if (!("comments" in tracks[trackID])) {
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
                throw err;
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
                n.result.unshift(trackID);

                dispatch(setObject(trackID + RELATED_PLAYLIST, obj_type, n.entities, n.result));
            })
            .catch(err => {
                throw err;
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

        updateLike(trackID, !liked);

    }
}

function updateLike(trackID, liked) {
    fetch(SC.updateLikeUrl(trackID), {
        method: (liked == 1) ? "PUT" : "DELETE"
    })
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
