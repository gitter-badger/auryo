import {PLAYLISTS} from '../constants/playlist';
import merge from 'lodash/merge';

import * as actionTypes from '../constants/actionTypes';

const initialState = {
    isPlaying: false,
    selectedPlaylists: [],
    currentSongIndex: null,
    currentTime: 0,

};

export default function player(state = initialState, action) {
    switch (action.type) {
        case actionTypes.CHANGE_CURRENT_TIME:
            return {
                ...state,
                currentTime: action.time,
            };
        case actionTypes.CHANGE_SELECTED_PLAYLISTS:
            return {
                ...state,
                selectedPlaylists: action.playlists
            };
        case actionTypes.CHANGE_PLAYING_SONG:
            return {
                ...state,
                currentSongIndex: action.songIndex
            };
        case actionTypes.TOGGLE_IS_PLAYING:
            return {
                ...state,
                isPlaying: action.isPlaying
            };

    }
    return state;
}