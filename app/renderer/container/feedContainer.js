import React, {Component} from "react";
import {connect} from "react-redux";

import {fetchMore} from "../actions";
import {getPlayingTrackId} from "../utils";

import {PLAYLISTS} from "../constants/playlist";
import {OBJECT_TYPES} from "../constants/global";

import PageHeader from "../components/PageHeader";
import InfinityScroll from "../components/infinityScrollComponent";
import TracksGrid from "../components/TracksGrid/TracksGrid";


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
    const {auth, entities, objects, player, app} = state;
    const current_playlist = PLAYLISTS.STREAM;
    const playlists = objects[OBJECT_TYPES.PLAYLISTS] || {};
    const {track_entities, user_entities, feedInfo_entities} = entities;
    const playingSongId = getPlayingTrackId(player, playlists);

    return {
        auth,
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
