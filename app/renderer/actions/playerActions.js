import {actionTypes, CHANGE_TYPES, PLAYER_STATUS, OBJECT_TYPES} from "../constants";
import {fetchMore} from "./objectActions";

const obj_type = OBJECT_TYPES.PLAYLISTS;

/**
 * Set player time to 0 and check if playlist is already in the queue and if it's selected
 *
 * @param trackIndex
 * @param playlist
 * @returns {function(*, *)}
 */
export function playTrack(trackIndex, playlist) {
    return (dispatch, getState) => {
        const {player} = getState();
        const {queuedPlaylists} = player;

        dispatch(setCurrentTime(0));

        const length = queuedPlaylists.length;

        if (length == 0 || queuedPlaylists[length - 1] !== playlist) {
            dispatch(setCurrentPlaylist(queuedPlaylists, playlist));
        }

        dispatch(setPlayingTrack(trackIndex));

    }
}

/**
 * Set current time for the song
 *
 * @param time
 * @returns {{type, time: *}}
 */
export function setCurrentTime(time) {
    return {
        type: actionTypes.PLAYER_SET_TIME,
        time
    };
}

/**
 * Toggle music on/off
 *
 * @param status
 * @returns {{type, playing: *}}
 */
export function toggleStatus(status) {
    return {
        type: actionTypes.PLAYER_TOGGLE_PLAYING,
        status
    };
}

/**
 * Set new playlist as first or add a playlist if it doesn't exist yet
 *
 * @param queuedPlaylists
 * @param playlist
 * @returns {{type, queuedPlaylists: *}}
 */
export function setCurrentPlaylist(queuedPlaylists, playlist) {
    const pos = queuedPlaylists.indexOf(playlist);
    if (pos > -1) {
        queuedPlaylists.splice(pos, 1);
    }
    queuedPlaylists.push(playlist);

    return {
        type: actionTypes.PLAYER_SET_PLAYLIST,
        queuedPlaylists,
    };
}

/**
 * Change the track based on the index in the playlist
 *
 * @param change_type
 * @returns {{type, index: *}}
 */
export function changeTrack(change_type) {
    return (dispatch, getState) => {
        const {player, objects} = getState();
        const playlists = objects[obj_type] || {};

        const {currentSong, queuedPlaylists} = player;
        const currentPlaylist = queuedPlaylists[queuedPlaylists.length - 1];
        const currentLength = playlists[currentPlaylist].items.length;

        let index = currentSong;

        switch (change_type) {
            case CHANGE_TYPES.NEXT:
                index += 1;
                break;
            case CHANGE_TYPES.PREV:
                index -= 1;
                break;
            case CHANGE_TYPES.SHUFFLE:
                index = Math.floor((Math.random() * (currentLength - 1)));
                break;

        }

        if (index < 0) {
            index = 0;
        } else if (index > (currentLength - 1)) {
            index = currentSong;
        }

        if (index + 5 > currentLength) {
            dispatch(fetchMore(currentPlaylist, obj_type));
        }

        dispatch(setPlayingTrack(index));
    }
}

/**
 * Set index as currentrackIndex & start playing
 *
 * @param index
 * @returns {{type, index: *, status: string}}
 */
function setPlayingTrack(index) {
    const status = PLAYER_STATUS.PLAYING;
    return {
        type: actionTypes.PLAYER_SET_TRACK,
        index,
        status
    }
}
