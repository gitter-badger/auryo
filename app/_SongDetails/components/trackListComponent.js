import React, {Component, PropTypes} from "react";

import {getPlayingTrackId} from "../../_common/utils";
import {playTrack} from "../../_common/actions";
import {isLiked} from "../../_common/utils/soundcloudUtils";

import {STATUS} from "../../_common/constants/playlist";

import TrackListItem from "./trackListItemComponent";


class trackList extends Component {

    playTrack(i, dbl, e) {
        const {playlist, dispatch, player} = this.props;

        if (!e) {
            e = dbl;
        }

        if (dbl) {
            e.preventDefault();
            dispatch(playTrack(i, playlist));
        } else {
            if (e.target.tagName == "TD" && (player.currentSong != i || player.status != STATUS.PLAYING)) {
                dispatch(playTrack(i, playlist));
            }
        }

    }


    render() {
        const {
            playlists,
            playlist,
            track_entities,
            user_entities,
            player,
            dispatch,
            likes,
            likeFunc
        } = this.props;

        const p = playlists[playlist];

        const items = (p && p.items) ? p.items : [];

        const playingTrackId = getPlayingTrackId(player, playlists);

        const _this = this;

        return (
            <div className="table-responsive trackList">
                <table className="table">
                    <thead>
                    <tr className="trackListHeader">
                        <th></th>
                        <th>
                            Title
                        </th>
                        <th className="trackArtist">
                            Artist
                        </th>
                        <th className="text-xs-center">
                            <i className="icon-timer"></i>
                        </th>
                        <th className="trackitemActions">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        items.map(function (trackId, i) {
                            if (i == 0) return;
                            const track = track_entities[trackId];

                            const like = likeFunc.bind(null, track.id);
                            const liked = isLiked(track.id, likes);

                            return (
                                <TrackListItem
                                    key={trackId}
                                    track={track}
                                    isPlaying={playingTrackId == track.id }
                                    playTrackFunc={_this.playTrack.bind(_this, i)}
                                    dispatch={dispatch}
                                    user_entities={user_entities}
                                    likeFunc={like}
                                    liked={liked}
                                />
                            );
                        })
                    }
                    </tbody>
                </table>
            </div>
        );
    }
}

trackList.propTypes = {
    playlists: PropTypes.object.isRequired,
    playlist: PropTypes.string.isRequired,
    track_entities: PropTypes.object.isRequired,
    user_entities: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    player: PropTypes.object.isRequired,
    likes: PropTypes.object.isRequired,
    likeFunc: PropTypes.func.isRequired
};


export default trackList;
