import * as SC from "../utils/soundcloudUtils"
import {setObject, setFetching} from "./objectActions"
import {OBJECT_TYPES} from "../constants/global"
import * as actionTypes from "../constants/actionTypes"
import {USER_TRACKS_PLAYLIST} from "../constants/playlist"
import {trackSchema} from "../schemas";
import {normalize, arrayOf} from "normalizr";

const obj_type = OBJECT_TYPES.PLAYLISTS;

export function fetchArtistIfNeeded(artistID) {
    return (dispatch, getState) => {
        const {entities, objects} = getState();
        const {user_entities} = entities;
        const playlists = objects[obj_type];


        if (!(artistID in user_entities) || !user_entities[artistID].followers_count) {
            dispatch(fetchUser(artistID));
        }

        const tracks_playlist = artistID + USER_TRACKS_PLAYLIST;

        if (playlists && !playlists[tracks_playlist]) {
            dispatch(fetchUserTracks(artistID));
        }

    }
}
function fetchUser(artistsID) {
    return dispatch => {
        fetch(SC.getUserUrl(artistsID))
            .then(response => response.json())
            .then(json => dispatch(setUser(json)));
    }
}

function setUser(user) {
    return {
        type: actionTypes.USER_SET,
        entities: {
            user_entities: {
                [user.id]: user
            }
        }
    }
}

function fetchUserTracks(artistID) {
    const playlist = artistID + USER_TRACKS_PLAYLIST;

    return dispatch => {
        dispatch(setFetching(playlist, obj_type, true));

        fetch(SC.getUserTracksUrl(artistID))
            .then(response => response.json())
            .then(json => {
                const collection = json.collection
                    .filter(track => (track.kind === 'track') && track.streamable);

                const n = normalize(collection, arrayOf(trackSchema));

                dispatch(setObject(artistID + USER_TRACKS_PLAYLIST, obj_type, n.entities, n.result, json.next_href, json.future_href));
            });
    }
}