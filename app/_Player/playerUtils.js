export function getPlayingTrackId(player, playlists) {
    if (player.currentSong !== null) {
        const playingPlaylistKey = player.queuedPlaylists[player.queuedPlaylists.length - 1];
        const playlist = playlists[playingPlaylistKey];
        if (!playlist) return null;

        return playlist.items[player.currentSong];

    }

    return null;
}

export function getCurrentPlaylist(player) {
    if (player && player.queuedPlaylists && player.queuedPlaylists.length > 0) {
        return player.queuedPlaylists[player.queuedPlaylists.length - 1];
    }

    return null;
}
