import * as SC from "../utils/soundcloudUtils";
import {arrayOf, normalize} from "normalizr";
import * as actionTypes from "../constants/actionTypes";
import {userSchema} from "../schemas/";
import {fetchLikes, fetchFeed, fetchPlaylists} from "./playlistActions";
import {ipcRenderer} from "electron";
import {setLoaded} from "./";
import * as _ from "lodash";


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
    return (dispatch,getState) => {
        const data = Promise.all([
            dispatch(fetchMe()),
            dispatch(fetchFollowings()),

            dispatch(fetchLikes()),
            dispatch(fetchFeed()),
            dispatch(fetchPlaylists())
        ]);

        data.then(() => {
            const {app} = getState();
            const {queued_items} = app;

            if(queued_items.length > 0){
                console.log("Not everything was loaded")
            } else {
                dispatch(setLoaded());
                console.log("Everything was loaded")
            }
        })
    };
}


/**
 * Fetch user data
 *
 * @returns {function(*)}
 */
function fetchMe() {
    return dispatch => {
        return fetch(SC.getMeUrl())
            .then((response) => response.json())
            .then((json) => {
                dispatch(setUser(json));
            })
            .catch(err => {
                dispatch(addQueuedFunction(fetchMe, arguments))
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
    return dispatch => {
        return fetch(SC.getFollowingsUrl())
            .then(response => response.json())
            .then(json => {
                const n = normalize(json.collection, arrayOf(userSchema));

                const result = _.reduce(n.result, (obj, t) => {
                    return Object.assign({}, obj, {[t]: 1})
                }, {});

                dispatch(setFollowings(n.entities, result));
            })
            .catch(err => {
                dispatch(addQueuedFunction(fetchFollowings, arguments))
            });
    }

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

export function toggleFollowing(userID) {
    return (dispatch, getState) => {
        const {user} = getState();
        const {followings} = user;

        const following = (userID in followings) && followings[userID] == 1;

        if (!(userID in followings)) {
            dispatch(addFollowing(userID));
        } else {
            dispatch(setFollowing(userID, (!following == false) ? 0 : 1));
        }

        dispatch(updateFollowing(userID, !following));

    }
}

function updateFollowing(userID, following) {
    return dispatch => {
        fetch(SC.updateFollowingUrl(userID), {
            method: (following == 1) ? "PUT" : "DELETE"
        }).catch(err => {
            dispatch(addQueuedFunction(updateFollowing.bind(null, userID, following), arguments))
        });
    }
}
function setFollowing(userID, following) {
    return {
        type: actionTypes.USER_SET_FOLLOWING,
        userID,
        following
    }
}

function addFollowing(userID) {
    return {
        type: actionTypes.USER_ADD_FOLLOWING,
        userID
    }
}
