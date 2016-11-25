// @flow
import React, {Component} from "react";
import PageHeader from "../_common/components/Pageheader/PageHeader";
import {PLAYLISTS} from "../_common/constants/playlist";
import {connect} from "react-redux";
import {fetchMore} from "../_common/actions";
import {getPlayingTrackId} from "../_Player/playerUtils";
import infiniteScroll from "../_common/components/InfiniteScroll";
import cn from "classnames";
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
        const {playingSongId} = this.props;

        const c = cn("main clearfix", {
            playing: playingSongId != null
        });
        return (
            <div className="scroll">
                <PageHeader title="Stream" img="./assets/img/party.jpg"/>
                <div className={c}>
                    <TracksGrid {...this.props} />
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const {user, entities, objects, player} = state;
    const current_playlist = PLAYLISTS.STREAM;
    const playlists = objects[OBJECT_TYPES.PLAYLISTS] || {};
    const {tracks, users, feedInfo} = entities;
    const playingSongId = getPlayingTrackId(player, playlists);

    return {
        user,
        feedInfo,
        tracks,
        playingSongId,
        users,
        current_playlist,
        playlists,
        scrollFunc: fetchMore.bind(this, current_playlist, OBJECT_TYPES.PLAYLISTS)
    }
}

export default connect(mapStateToProps)(infiniteScroll(FeedContainer));
