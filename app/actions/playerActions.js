import * as actionTypes from "../constants/actionTypes";
import {CHANGE_TYPES} from "../constants/playlist";
import Sound from "../components/common/Sound-React";

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
    const {player, playlists} = getState();
    const {currentSong, queuedPlaylists} = player;
    const currentPlaylist = queuedPlaylists[queuedPlaylists.length - 1];

    let index = currentSong;

    switch (change_type) {
      case CHANGE_TYPES.NEXT:
        index += 1;
        break;
      case CHANGE_TYPES.PREV:
        index -= 1;
        break;
      case CHANGE_TYPES.SHUFFLE:
        index = Math.floor((Math.random() * playlists[currentPlaylist].items.length - 1));
        break;

    }

    if (index < 0) {
      //dispatch(fetchMore(currentPlaylist));
      return null;
    }

    return dispatch(setPlayingTrack(index));
  }
}

function setPlayingTrack(index) {
  const status = Sound.status.PLAYING;
  return {
    type: actionTypes.PLAYER_SET_TRACK,
    index,
    status
  }
}
