import React, {Component, PropTypes} from "react";

import {playTrack} from "../../actions";
import {SC} from "../../utils";
import {PLAYER_STATUS} from "../../constants";

import TrackListItem from "./trackListItemComponent";

class trackList extends Component {

    playTrack(i, dbl, e) {
        const {playlist_name, dispatch, player} = this.props;

        if (!e) {
            e = dbl;
        }

        if (dbl) {
            e.preventDefault();
            dispatch(playTrack(i, playlist_name));
        } else {
            if (e.target.tagName == "TD" && (player.currentSong != i || player.status != PLAYER_STATUS.PLAYING)) {
                dispatch(playTrack(i, playlist_name));
            }
        }

    }


    render() {
        const {
            playlist,
            track_entities,
            user_entities,
            player,
            dispatch,
            likes,
            playingTrackId,
            likeFunc
        } = this.props;

        const items = (playlist && playlist.items) ? playlist.items : [];


        const _this = this;

        return (
            <div className="table-responsive trackList">
                <table className="table">
                    <thead>
                    <tr className="trackListHeader">
                        <th/>
                        <th>
                            Title
                        </th>
                        <th className="trackArtist">
                            Artist
                        </th>
                        <th className="text-xs-center">
                            <i className="icon-timer"/>
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
                            const liked = SC.isLiked(track.id, likes);

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
    playingTrackId: PropTypes.number,
    playlist_name: PropTypes.string.isRequired,
    playlist: PropTypes.object.isRequired,
    track_entities: PropTypes.object.isRequired,
    user_entities: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    player: PropTypes.object.isRequired,
    likes: PropTypes.object.isRequired,
    likeFunc: PropTypes.func.isRequired
};

export default trackList;
