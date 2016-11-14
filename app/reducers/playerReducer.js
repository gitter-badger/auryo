import * as actionTypes from "../constants/actionTypes";
import Sound from "../components/Sound-React";

const initialState = {
  status: Sound.status.STOPPED,
  queuedPlaylists: [],
  currentSong: null,
  currentTime: 0,

};

export default function player(state = initialState, action) {
  switch (action.type) {
    case actionTypes.PLAYER_SET_TRACK:
      return {
        ...state,
        currentSong: action.index,
        status: action.status
      };
    case actionTypes.PLAYER_TOGGLE_PLAYING:
      return {
        ...state,
        status: action.status,
      };
    case actionTypes.PLAYER_SET_PLAYLIST:
      return {
        ...state,
        queuedPlaylists: action.queuedPlaylists,
      };
    case actionTypes.PLAYER_SET_TIME:
      return {
        ...state,
        currentTime: action.time,
      };

  }
  return state;
}
