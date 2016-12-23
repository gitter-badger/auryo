import {actionTypes}  from "../../constants"
import {SC} from "../../utils"
import {addQueuedFunction} from "../"

export function toggleFollowing(userID) {
    return (dispatch, getState) => {
        const {auth} = getState();
        const {followings} = auth;

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
        type: actionTypes.AUTH_SET_FOLLOWING,
        userID,
        following
    }
}

function addFollowing(userID) {
    return {
        type: actionTypes.AUTH_ADD_FOLLOWING,
        userID
    }
}
