import {SC} from "../../utils";
import {actionTypes}  from "../../constants"
import {addQueuedFunction} from "../"

/**
 * Toggle like
 *
 * @param trackID Track to toggle like on
 * @returns {function(*, *)}
 */

export function toggleLike(trackID) {
    return (dispatch, getState) => {
        const {auth} = getState();
        const {likes} = auth;

        const liked = (trackID in likes) ? likes[trackID] : 0;

        dispatch(updateLike(trackID, !liked));

    }
}

/**
 * Update likes on soundcloud, dispatch to store if no error
 *
 * @param trackID   - Track id to change like
 * @param liked     - Liked or not
 * @returns {function(*)}
 */

function updateLike(trackID, liked) {
    return dispatch => {
        fetch(SC.updateLikeUrl(trackID), {
            method: (liked == 1) ? "PUT" : "DELETE"
        })
            .then(handleErrors)
            .then((r) => {
                dispatch(setLike(trackID, liked));
            })
            .catch(err => {
                dispatch(addQueuedFunction(updateLike.bind(null, trackID, liked), arguments))
            })
    }
}

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

/**
 * Set auth like to the liked var
 *
 * @param trackID   - Track id to change like
 * @param liked     - Liked or not
 * @returns {{type, trackID: *, liked: *}}
 */

function setLike(trackID, liked) {
    return {
        type: actionTypes.AUTH_SET_LIKE,
        trackID,
        liked
    }
}