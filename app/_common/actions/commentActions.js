import * as SC from "../utils/soundcloudUtils";
import {isFetching, setObject} from "./objectActions";
import {OBJECT_TYPES} from "../constants/global";
import {normalize, arrayOf} from "normalizr";
import {commentSchema} from "../schemas/";

const obj_type = OBJECT_TYPES.COMMENTS;

export function fetchComments(trackID) {
    return dispatch => {
        dispatch(isFetching(trackID, obj_type));

        fetch(SC.getCommentsUrl(trackID))
            .then(response => response.json())
            .then(json => {
                const collection = json.collection;
                const n = normalize(collection, arrayOf(commentSchema));

                dispatch(setObject(trackID, obj_type, n.entities, n.result, json.next_href));
            })
            .catch(err => {
                throw err;
            });
    }
}
