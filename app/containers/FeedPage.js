// @flow
import React, {Component,PropTypes} from 'react';
import Feed from '../components/Feed';
import PageHeader from '../components/PageHeader/PageHeader';
import {PLAYLISTS} from '../constants/playlist'
import { connect } from 'react-redux';
import {fetchSongsIfNeeded} from '../actions/auth.actions';


class FeedPage extends Component {

    render() {

        return (
            <div>
                <PageHeader title="Stream"/>
                <Feed {...this.props}/>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const {auth,entities,playlists,environment} = state;
    const playlist = PLAYLISTS.STREAM;
    const {tracks, track_info, users} = entities;
    const { height } = environment;
    return {
        auth,
        height,
        tracks,
        track_info,
        users,
        playlist,
        playlists,
        scrollFunc: fetchSongsIfNeeded.bind(null, playlist)
    }
}

export default connect(mapStateToProps)(FeedPage);