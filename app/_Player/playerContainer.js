// @flow
import React, {Component} from "react";
import Player from "./components/Player/playerComponent";
import {connect} from "react-redux";
import {getPlayingTrackId} from "./playerUtils";
import {OBJECT_TYPES} from "../_common/constants/global";

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
    const {entities, player, objects} = state;
    const {tracks, users} = entities;
    const playlists = objects[OBJECT_TYPES.PLAYLISTS] || {};
    const playingSongId = getPlayingTrackId(player, playlists);

    return {
        player,
        playingSongId,
        playlists,
        tracks,
        users,
    };
}

export default connect(mapStateToProps)(PlayerContainer);
