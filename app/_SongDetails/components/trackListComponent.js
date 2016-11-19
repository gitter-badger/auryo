import React, {Component, PropTypes} from "react";
import TrackListItem from "./trackListItemComponent";
import {getPlayingTrackId} from "../../_Player/playerUtils";
import {playTrack} from "../../_common/actions/index";
import {isLiked} from "../../_common/utils/soundcloudUtils";


class trackList extends Component {

  playTrack(i, e) {
    const {playlist, dispatch} = this.props;

    e.preventDefault();
    dispatch(playTrack(i, playlist));
  }


  render() {
    const {
      playlists,
      playlist,
      tracks,
      users,
      player,
      dispatch,
      likes,
      likeFunc
    } = this.props;

    const p = playlists[playlist];

    const items = (p && p.items) ? p.items : [];

    const playingTrackId = getPlayingTrackId(player, playlists);

    const _this = this;

    return (
      <div className="trackList">
        {
          items.map(function (trackId, i) {
            if (i == 0) return;
            const track = tracks[trackId];
            const playTrackFunc = _this.playTrack.bind(_this, i);

            const like = likeFunc.bind(null, track.id);
            const liked = isLiked(track.id,likes);

            return (
              <TrackListItem
                key={trackId}
                track={track}
                isPlaying={playingTrackId == track.id }
                playTrackFunc={playTrackFunc}
                dispatch={dispatch}
                users={users}
                likeFunc={like}
                liked={liked}
              />
            );
          })
        }
      </div>
    );
  }
}

trackList.propTypes = {
  playlists: PropTypes.object.isRequired,
  playlist: PropTypes.string.isRequired,
  tracks: PropTypes.object.isRequired,
  users: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  player: PropTypes.object.isRequired,
  likes: PropTypes.object.isRequired,
  likeFunc: PropTypes.func.isRequired
};


export default trackList;
