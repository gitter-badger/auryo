import * as SC from "../utils/soundcloudUtils";
import {isFetching, setObject} from "./objectActions";
import {OBJECT_TYPES} from "../constants/global";
import {normalize, arrayOf} from "normalizr";
import {commentSchema} from "../schemas/";

const obj_type = OBJECT_TYPES.COMMENTS;

/**
 * Fetch track comments and normalize them into objects
 *
 * @param trackID
 * @returns {function(*)}
 */
export function fetchComments(trackID) {
    return dispatch => {
        dispatch(updateComments(SC.getCommentsUrl(trackID),trackID));
    }
}

export function updateComments(nextUrl,object_id) {
    return dispatch => {
        dispatch(isFetching(object_id, obj_type));

        fetch(nextUrl)
            .then(response => response.json())
            .then(json => {
                const collection = json.collection;
                const n = normalize(collection, arrayOf(commentSchema));

                dispatch(setObject(object_id, obj_type, n.entities, n.result, json.next_href));
            })
            .catch(err => {
                throw err;
            });
    }
}
