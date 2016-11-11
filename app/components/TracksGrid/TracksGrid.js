import React, {Component, PropTypes} from "react";
import TrackGridItem from "../../components/TrackGridItem/TrackGridItem";
import {fetchMore, playTrack,setCurrentTime} from "../../actions";
import infiniteScroll from "../../components/InfiniteScroll";
import Spinner from "../Spinner/index";
import Sound from "../common/Sound-React";


class TracksGrid extends Component {

  playTrack(i, e) {
    e.preventDefault();
    const {current_playlist, dispatch} = this.props;
    dispatch(playTrack(i, current_playlist));
  }

  render() {

    const {
      user,
      feedInfo,
      tracks,
      playingSongId,
      users,
      current_playlist,
      playlists,
      dispatch
    } = this.props;
    const items = current_playlist in playlists ? playlists[current_playlist].items : [];
    const isFetching = playlists[current_playlist].isFetching;
    const scrollFunc = fetchMore.bind(null, current_playlist);

    // TODO find a good way for lazy loading

    return (
      <div className="songs">
        <div className="row">
          {

            items.map((uuid, i) => {
              const info = feedInfo[uuid];
              const track = tracks[info.track];
              track.user = users[track.user_id];
              track.from_user = users[info.user];
              track.activity_type = info.type;

              const playTrackFunc = this.playTrack.bind(this, i);

              return (

                <TrackGridItem key={track.id + '-' + i}
                               playTrackFunc={playTrackFunc}
                               user={user}
                               dispatch={dispatch}
                               isPlaying={track.id === playingSongId}
                               scrollFunc={scrollFunc}
                               track={track}/>

              );
            })
          }
        </div>
        {isFetching ? <Spinner /> : null}
      </div>
    );
  }
}

TracksGrid.propTypes = {
  user: PropTypes.object.isRequired,
  feedInfo: PropTypes.object.isRequired,
  tracks: PropTypes.object.isRequired,
  playingSongId: PropTypes.string,
  users: PropTypes.object.isRequired,
  current_playlist: PropTypes.string.isRequired,
  playlists: PropTypes.object.isRequired,
  scrollFunc: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired
};
export default TracksGrid;
