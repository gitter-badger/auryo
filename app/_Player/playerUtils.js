export function getPlayingTrackId(player, playlists, feedInfo = null) {
  if (player.currentSong !== null) {
    const playingPlaylistKey = player.queuedPlaylists[player.queuedPlaylists.length - 1];
    const playlist = playlists[playingPlaylistKey];
    if(!playlist) return null;

    var id = playlist.items[player.currentSong];

    if (id) {
      if (id.length == 36 && feedInfo) {
        id = feedInfo[id].track;
      }
      return id.toString();
    }

    return null;

  }

  return null;
}

export function getCurrentPlaylist(player) {
  if(player && player.queuedPlaylists && player.queuedPlaylists .length > 0){
    return player.queuedPlaylists[player.queuedPlaylists.length - 1];
  }

  return null;
}
