import React, {Component, PropTypes} from "react";
import TrackGridItem from "./TrackGridItem";
import {fetchMore, playTrack} from "../../../_common/actions";
import Spinner from "../../../_common/components/Spinner";
import ReactList from "./reactlist";
//import ReactList from "react-list";

class TracksGrid extends Component {
  constructor(props) {
    super(props);

    this.renderItem = this.renderItem.bind(this);
  }

  playTrack(i, e) {
    const {current_playlist, dispatch} = this.props;

    e.preventDefault();
    dispatch(playTrack(i, current_playlist));
  }

  renderItem(index, key) {

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
    const scrollFunc = fetchMore.bind(null, current_playlist);

    const uuid = items[index];

    const info = feedInfo[uuid];
    const track = tracks[info.track];
    track.user = users[track.user_id];
    track.from_user = users[info.user];
    track.activity_type = info.type;

    const playTrackFunc = this.playTrack.bind(this, index);

    return (

      <TrackGridItem key={key}
                     playTrackFunc={playTrackFunc}
                     user={user}
                     dispatch={dispatch}
                     isPlaying={track.id === playingSongId}
                     scrollFunc={scrollFunc}
                     track={track}/>

    );
  }

  renderWrapper(items, ref) {
    return <div className="row" ref={ref}>{items}</div>
  }

  render() {

    const {
      current_playlist,
      playlists
    } = this.props;
    const items = current_playlist in playlists ? playlists[current_playlist].items : [];
    const isFetching = playlists[current_playlist].isFetching;

    return (
      <div className="songs">
        <ReactList
          type="uniform"
          length={items.length}
          itemsRenderer={this.renderWrapper}
          itemRenderer={this.renderItem}
          useStaticSize={true}
          threshold={150}
        />
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
