import * as actionTypes from '../constants/actionTypes';

const initialState = {
    trackEntities: {},
    trackIds: [],
    activeTrackId: null
};

export default function(state = initialState, action) {
    switch (action.type) {
        case actionTypes.TRACKS_SET:
            return setTracks(state, action);
        case actionTypes.TRACK_PLAY:
            return setPlay(state, action);
    }
    return state;
}

function setTracks(state, action) {
    const { trackEntities, trackIds } = action;
    return { ...state, trackEntities, trackIds };
}

function setPlay(state, action) {
    const { trackId } = action;
    return { ...state, activeTrackId: trackId };
}