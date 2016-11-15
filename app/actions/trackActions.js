import * as SC from "../utils/soundcloudUtils";
import {trackSchema} from "../schemas/";
import {normalize, arrayOf} from "normalizr";
import * as actionTypes from "../constants/actionTypes";
import {setPlaylist} from "./playlistActions";
import {RELATED_PLAYLIST} from "../constants/playlist";

export function fetchTrackIfNeeded(trackID) {
  return (dispatch, getState) => {
    const {tracks} = getState().entities;

    if (!(trackID in tracks)) {
      dispatch(fetchTrack(trackID));
      dispatch(fetchRelated(trackID));
    }

  }
}

function fetchTrack(trackID) {
  return dispatch => {
    fetch(SC.getTrackUrl(trackID))
      .then((response) => response.json())
      .then(json => {
        const n = normalize(json, trackSchema);

        dispatch(addSong(n.entities, n.result));
      })
      .catch(err => {
        throw err;
      });
  }
}

function fetchRelated(trackID) {
  return dispatch => {
    fetch(SC.getRelatedUrl(trackID))
      .then(response => response.json())
      .then(json => {
        const n = normalize(json, arrayOf(trackSchema));
        n.result.unshift(trackID);

        dispatch(setPlaylist(trackID + RELATED_PLAYLIST, n.entities, n.result));
      });
  }
}

function fetchComments(trackID) {
  return dispatch => {

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
      dispatch(setLike(trackID,(!liked == false) ? 0 : 1));
    }

    updateLike(trackID,!liked);

  }
}

function updateLike(trackID,liked){
  fetch(SC.updateLikeUrl(trackID),{
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


function addSong(entities, result) {
  return {
    type: actionTypes.TRACK_ADD,
    entities,
    result
  };
}
