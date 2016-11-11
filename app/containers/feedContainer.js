// @flow
import React, {Component, PropTypes} from "react";
import Feed from "../components/Feed/feedComponent";
import PageHeader from "../components/PageHeader/PageHeader";
import {PLAYLISTS} from "../constants/playlist";
import {connect} from "react-redux";
import {fetchMore} from "../actions/";
import {getPlayingTrackId} from "../utils/playerUtils";
import infiniteScroll from "../components/InfiniteScroll";
import cn from "classnames";


class FeedContainer extends Component {

  render() {
      const {playingSongId} = this.props;

    const c = cn("main","clearfix",{
      playing: playingSongId != null
    });
    return (
      <div className={c}>
          <PageHeader title="Stream"/>
          <Feed {...this.props}/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const {user, entities, playlists, player} = state;
  const current_playlist = PLAYLISTS.STREAM;
  const {tracks, users, feedInfo} = entities;
  const playingSongId = getPlayingTrackId(player, playlists, feedInfo);

  return {
    user,
    feedInfo,
    tracks,
    playingSongId,
    users,
    current_playlist,
    playlists,
    scrollFunc: fetchMore.bind(this, current_playlist)
  }
}

export default connect(mapStateToProps)(infiniteScroll(FeedContainer));
