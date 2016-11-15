import * as SC from "../utils/soundcloudUtils";
import {arrayOf, normalize} from "normalizr";
import * as actionTypes from "../constants/actionTypes";
import {userSchema} from "../schemas/";
import {fetchLikes, fetchFeed, fetchPlaylists} from "./playlistActions";
import {ipcRenderer} from "electron";

/**
 * Get token from config and initialize Soundcloud class
 *
 * @returns {function(*)}
 */
export function initUser() {
  return dispatch => {

    const token = ipcRenderer.sendSync('ping');

      if (token) {
        SC.initialize(token);
        dispatch(fetchUser());
      }


    return null;
  }
}

export function logout() {
  ipcRenderer.send("logout");
}

function fetchUser() {
  return dispatch => {
    dispatch(fetchMe());
    dispatch(fetchFollowings());

    dispatch(fetchLikes());
    dispatch(fetchFeed());
    dispatch(fetchPlaylists());
  };
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
      .then((json) => {
        dispatch(setUser(json));
      })
      .catch(err => {
        throw err;
      });
  }
}

/**
 * Save user
 *
 * @param user
 * @returns {{type, user: *}}
 */
function setUser(user) {
  return {
    type: actionTypes.USER_SET,
    user
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
        const n = normalize(json.collection, arrayOf(userSchema));
        dispatch(setFollowings(n.entities, n.result));
      })
      .catch(err => {
        throw err;
      });
}

/**
 * Save user followings
 *
 * @param entities
 * @param result
 * @returns {{type: *, entities: *, result: *}}
 */
function setFollowings(entities, result) {
  return {
    type: actionTypes.USER_SET_FOLLOWINGS,
    entities,
    result,
  };
}
