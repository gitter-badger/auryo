import {normalize, arrayOf} from "normalizr";

import {SC} from "../../utils";
import {setFetching, setObject} from "../objectActions";
import {addQueuedFunction} from "../";
import {OBJECT_TYPES} from "../../constants";
import {commentSchema} from "../../schemas/";

const obj_type = OBJECT_TYPES.COMMENTS;

/**
 * Fetch comments for first time with fresh url
 *
 * @param trackID
 * @returns {function(*)}
 */
export function fetchComments(trackID) {
    return dispatch => {
        dispatch(updateComments(SC.getCommentsUrl(trackID), trackID));
    }
}

/**
 * Fetch comments using any url
 *
 * @param nextUrl
 * @param object_id
 * @returns {function(*, *)}
 */
export function updateComments(nextUrl, object_id) {
    return (dispatch, getState) => {
        const {objects} = getState();
        const comments = objects[obj_type];

        if (comments[object_id] && comments[object_id].isFetching) return;

        dispatch(setFetching(object_id, obj_type, true));

        fetch(nextUrl)
            .then(response => response.json())
            .then(json => {
                const collection = json.collection;
                const n = normalize(collection, arrayOf(commentSchema));

                dispatch(setObject(object_id, obj_type, n.entities, n.result, json.next_href));
            })
            .catch(err => {
                dispatch(setFetching(object_id, obj_type, false));
                dispatch(addQueuedFunction(updateComments.bind(null, nextUrl, object_id), arguments));
            });
    }
}
