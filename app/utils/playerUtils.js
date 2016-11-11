export function getPlayingTrackId(player, playlists, feedInfo) {
  if (player.currentSong !== null) {
    const playingPlaylistKey = player.queuedPlaylists[player.queuedPlaylists.length - 1];
    const playlist = playlists[playingPlaylistKey];

    var id = playlist.items[player.currentSong];

    if (id) {
      if (id.length == 36) {
        id = feedInfo[id].track;
      }
      return id.toString();
    }

    return null;

  }

  return null;
}
