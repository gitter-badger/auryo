import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";

import {getPlayingTrackId} from "../utils";
import {OBJECT_TYPES} from "../constants";

import Player from "../components/Player/playerComponent";

import "../assets/css/Player/player.scss"

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
    const {entities:{track_entities, user_entities}, player, objects, app} = state;
    const playlists = objects[OBJECT_TYPES.PLAYLISTS] || {};
    const playingSongId = getPlayingTrackId(player, playlists);

    return {
        player,
        playingSongId,
        playlists,
        track_entities,
        user_entities,
        app
    };
}

export default connect(mapStateToProps)(PlayerContainer);
