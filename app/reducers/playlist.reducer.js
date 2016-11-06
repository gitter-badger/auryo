import {PLAYLISTS} from '../constants/playlist';
import merge from 'lodash/merge';

import * as actionTypes from '../constants/actionTypes';

const initialPlaylistState = {
    isFetching: false,
    items: [],
    futureUrl: false,
    nextUrl: false,

};

function playlist(state = initialPlaylistState, action) {

    switch (action.type) {
        case actionTypes.REQUEST_SONGS:
            return {
                ...state,
                isFetching: true,
                nextUrl: null
            };
        case actionTypes.RECEIVE_PLAYLIST:
            return {
                ...state,
                isFetching: false,
                items: [...state.items, ...action.songs],
                futureUrl: action.futureUrl,
                nextUrl: action.nextUrl
            };
        case actionTypes.RECEIVE_NEW_STREAM_SONGS:
            return {
                ...state,
                futureUrl: action.futureUrl
            };
    }
    return state;
}

const initialState = {
    [PLAYLISTS.LIKES]: initialPlaylistState,
    [PLAYLISTS.STREAM]: initialPlaylistState
};

export default function playlists(state = initialState, action) {
    switch (action.type) {
        case actionTypes.REQUEST_SONGS:
            return {
                ...state,
                [action.playlist]: playlist(state[action.playlist], action),
            };
        case actionTypes.RECEIVE_PLAYLIST:
            return {
                ...state,
                [action.playlist]: playlist(state[action.playlist], action),
            };
        case actionTypes.RECEIVE_NEW_STREAM_SONGS:
            return {
                ...state,
                [PLAYLISTS.STREAM]: playlist(state[PLAYLISTS.STREAM], action),
            };

    }
    return state;
}