// @flow
import React, {Component} from 'react';
import Player from '../components/Player/Player';
import {connect} from 'react-redux';
import {getPlayingSongId} from '../utils/PlayerUtils';

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
    const {tracks, users} = entities;
    const playingSongId = getPlayingSongId(player, playlists);

    return {
        player,
        playingSongId,
        playlists,
        tracks,
        users,
    };
}

export default connect(mapStateToProps)(PlayerContainer);