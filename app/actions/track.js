import * as actionTypes from '../constants/actionTypes';

export function setTracks(trackEntities, trackIds) {
    return {
        type: actionTypes.TRACKS_SET,
        trackEntities,
        trackIds
    };
}

export function playTrack(track) {
    return {
        type: actionTypes.TRACK_PLAY,
        track
    };
}