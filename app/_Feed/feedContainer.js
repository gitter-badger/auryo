import React, {Component} from "react";
import PageHeader from "../_common/components/Pageheader/PageHeader";
import {PLAYLISTS} from "../_common/constants/playlist";
import {connect} from "react-redux";
import {fetchMore} from "../_common/actions";
import {getPlayingTrackId} from "../_Player/playerUtils";
import InfinityScroll from "../_common/components/InfiniteScroll";
import TracksGrid from "./components/TracksGrid/TracksGrid";
import {OBJECT_TYPES} from "../_common/constants/global";


class FeedContainer extends Component {

  componentWillMount() {
    const {dispatch, playlist, playlists} = this.props;
    if (!(playlist in playlists) || playlists[playlist].items.length === 0) {
      dispatch(fetchMore(playlist, OBJECT_TYPES.PLAYLISTS));
    }
  }

  componentWillReceiveProps(nextProps) {
    const {dispatch, playlist, playlists} = this.props;
    if (playlist !== nextProps.playlist) {
      if (!(nextProps.playlist in playlists) || playlists[nextProps.playlist].items.length === 0) {
        dispatch(fetchMore(nextProps.playlist, OBJECT_TYPES.PLAYLISTS));
      }
    }
  }

  render() {
    const {playingSongId, scrollFunc, dispatch} = this.props;

    return (
      <InfinityScroll
        dispatch={dispatch}
        scrollFunc={scrollFunc}
        fastScrolling={true}
        playing={playingSongId != null}>
        <PageHeader title="Stream" img="./assets/img/party.jpg"/>
        <div className="main clearfix">
          <TracksGrid {...this.props} />
        </div>
      </InfinityScroll>
    );
  }
}

function mapStateToProps(state) {
  const {user, entities, objects, player, app} = state;
  const current_playlist = PLAYLISTS.STREAM;
  const playlists = objects[OBJECT_TYPES.PLAYLISTS] || {};
  const {track_entities, user_entities, feedInfo_entities} = entities;
  const playingSongId = getPlayingTrackId(player, playlists);

  return {
    user,
    feedInfo_entities,
    track_entities,
    playingSongId,
    user_entities,
    current_playlist,
    playlists,
    app,
    scrollFunc: fetchMore.bind(this, current_playlist, OBJECT_TYPES.PLAYLISTS)
  }
}

export default connect(mapStateToProps)(FeedContainer);
