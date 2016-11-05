import React, {Component, PropTypes} from 'react';
import {IMAGE_SIZES} from '../../constants/Soundcloud';
import {getImageUrl} from '../../utils/soundcloud';
import classnames from 'classnames';

import {truncate,abbreviate_number} from '../../utils/AppUtils';

class SongCard extends Component {

    renderTrackType(track) {
        switch (track.t_info.type) {
            case "track-repost":
                return (
                    <div className="typeRepost">
                        <a href="">{track.t_info.from.username}</a>
                        <i className="icon-retweet2"></i>
                        <span>reposted a track</span>
                    </div>
                );
            case "track":
                return (
                    <div className="typeTrack">
                        <a href="">{track.user.username}</a>
                        <span>posted a new track</span>
                    </div>
                )
        }
    }

    render() {

        const {track, playSong, isPlaying} = this.props;
        const image = getImageUrl(track.artwork_url, IMAGE_SIZES.LARGE);

        const icon = classnames(
            {
                'icon-controller-play': !isPlaying,
                'icon-controller-pause': isPlaying
            }
        );

        const playing = classnames(
            "track",
            {
                "isPlaying" : isPlaying
            }
        );

        return (
            <div className="col-xs-6 col-sm-6 col-lg-4 col-xl-s-5">
                <div className={playing}>

                    <div className="trackHeader">
                        {
                            this.renderTrackType(track)
                        }
                    </div>

                    <div className="trackImage">
                        <div className="imageWrapper">
                            <img src={image}/>
                            <a className="playButton" onClick={() => playSong(track)}>
                                <i className={icon}></i>
                            </a>
                            <div className="trackStats">
                                <div className="stat">
                                    <i className="icon-heart-outlined"></i>
                                    <span>{abbreviate_number(track.likes_count)}</span>
                                </div>
                                <div className="stat">
                                    <i className="icon-controller-play"></i>
                                    <span>{abbreviate_number(track.playback_count)}</span>
                                </div>
                            </div>
                        </div>
                        {
                            track.genre ? <a className="trackGenre">{track.genre}</a> : null
                        }

                    </div>

                    <div className="trackInfo">
                        <div className="trackTitle">
                            {
                                track.publisher_metadata.release_title ? track.publisher_metadata.release_title : truncate(track.title, 35)
                            }
                        </div>

                        <div className="trackArtist">
                            {
                                track.publisher_metadata.artist ? track.publisher_metadata.artist : track.user.username
                            }
                            {
                                track.publisher_metadata.explicit ? <span className="explicit">explicit</span> : null
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

SongCard.propTypes = {
    track: PropTypes.object.isRequired,
    playSong: PropTypes.func.isRequired,
    isPlaying: PropTypes.bool.isRequired
};

export default SongCard;