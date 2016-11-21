import * as SC from "../utils/soundcloudUtils";
import {trackSchema} from "../schemas";
import {normalize, arrayOf} from "normalizr";
import * as actionTypes from "../constants/actionTypes";
import {setPlaylist} from "./playlistActions";
import {RELATED_PLAYLIST} from "../constants/playlist";

export function fetchTrackIfNeeded(trackID) {
  return (dispatch, getState) => {
    const {entities, playlists} = getState();
    const {tracks} = entities;
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

        dispatch(setPlaylist(trackID + RELATED_PLAYLIST, n.entities, n.result));
      })
      .catch(err => {
        throw err;
      });
  }
}

function fetchComments(trackID) {
  return dispatch => {
    fetch(SC.getCommentsUrl(trackID))
      .then(response => response.json())
      .then(json => {
        dispatch(setComments(trackID, json));
      })
      .catch(err => {
        throw err;
      });
  }
}

function setComments(trackID, comments) {
  return {
    type: actionTypes.TRACK_ADD_COMMENTS,
    entities: {
      tracks:{
        [trackID]: {
          comments
        }
      }
    }
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
