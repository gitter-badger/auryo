import {PLAYLISTS} from "../constants/playlist";
import * as actionTypes from "../constants/actionTypes";
import merge from 'lodash/merge';

const initialPlaylistState = {
  isFetching: false,
  items: [],
  futureUrl: false,
  nextUrl: false,

};

function playlist(state = initialPlaylistState, action) {

  switch (action.type) {
    case actionTypes.PLAYLIST_IS_FETCHING:
      return {
        ...state,
        isFetching: true,
        nextUrl: null
      };
    case actionTypes.PLAYLIST_SET:
      return {
        ...state,
        isFetching: false,
        items: [...state.items, ...action.result],
        futureUrl: action.futureUrl,
        nextUrl: action.nextUrl
      };
    case actionTypes.USER_SET_NEW_FEED_ITEMS:
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
    case actionTypes.PLAYLIST_IS_FETCHING:
      return {
        ...state,
        [action.name]: playlist(state[action.name], action),
      };
    case actionTypes.PLAYLIST_SET:
      return {
        ...state,
        [action.name]: playlist(state[action.name], action),
      };
    case actionTypes.USER_SET_NEW_FEED_ITEMS:
      return {
        ...state,
        [PLAYLISTS.STREAM]: playlist(state[PLAYLISTS.STREAM], action),
      };

  }
  return state;
}
