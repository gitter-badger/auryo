import * as actionTypes from "../constants/actionTypes";
import * as SC from "../utils/soundcloudUtils";
import {OBJECT_TYPES} from "../constants/global";
import {fetchPlaylist} from "./playlistActions";

/**
 * Check if there is more to fetch, if so, fetch more
 *
 * @param object_id
 * @param type
 * @returns {function(*, *)}
 */
export function fetchMore(object_id, type) {
    return (dispatch, getState) => {
        const {objects} = getState();
        const objectgroup = objects[type] || {};

        if (canFetchMore(objectgroup, object_id)) {
            const nextUrl = objectgroup[object_id].nextUrl;
            if (type == OBJECT_TYPES.PLAYLISTS) {
                return dispatch(fetchPlaylist(nextUrl, object_id));
            }
        }

        return null;
    };
}

/**
 * Check if the current playlist isn't fetching & has a next Url
 *
 * @param object_group
 * @param object_id
 * @returns {*|boolean}
 */
function canFetchMore(object_group, object_id) {
    const current = object_group[object_id];

    return current && (current.nextUrl !== null) && !current.isFetching;

}

/**
 * set playlist isfetching property
 *
 * @param object_id
 * @param object_type
 * @returns {{type, name: *}}
 */
export function isFetching(object_id, object_type) {
    return {
        type: actionTypes.OBJECT_IS_FETCHING,
        object_type,
        object_id
    };
}

/**
 * Save playlist
 *
 * @param object_id
 * @param object_type
 * @param entities
 * @param result
 * @param nextUrl
 * @param futureUrl
 * @returns {{type: *, name: *, entities: *, result: *, nextUrl: *, futureUrl: *}}
 */
export function setObject(object_id, object_type, entities, result, nextUrl = null, futureUrl = null) {

    nextUrl = (nextUrl) ? SC.appendToken(nextUrl) : null;
    futureUrl = (futureUrl) ? SC.appendToken(futureUrl) : null;

    return {
        type: actionTypes.OBJECT_SET,
        object_type,
        object_id,
        entities,
        result,
        nextUrl,
        futureUrl
    };
}

/**
 * Save new feed items
 *
 * @param object_id
 * @param object_type
 * @param futureUrl
 * @param entities
 * @param result
 * @returns {{type, entities: *, result: *, futureUrl: *}}
 */
export function setNewObjects(object_id, object_type, futureUrl, entities, result) {

    futureUrl = (futureUrl) ? SC.appendToken(futureUrl) : null;

    return {
        type: actionTypes.OBJECT_SET_NEW_ITEMS,
        object_id,
        object_type,
        entities,
        result,
        futureUrl
    };
}
