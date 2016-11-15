// @flow
import React, {Component} from "react";
import Player from "./components/Player/playerComponent";
import {connect} from "react-redux";
import {getPlayingTrackId} from "./playerUtils";

class PlayerContainer extends Component {
  render() {
    const {playingSongId} = this.props;

    if (playingSongId == null) {
      return <div/>
    }

    return (
      <Player {...this.props} />
    );
  }
}


function mapStateToProps(state) {
  const {entities, player, playlists} = state;
  const {tracks, users, feedInfo} = entities;
  const playingSongId = getPlayingTrackId(player, playlists, feedInfo);

  return {
    player,
    playingSongId,
    playlists,
    tracks,
    users,
  };
}

export default connect(mapStateToProps)(PlayerContainer);
