import React, {Component, PropTypes} from 'react';
import {IMAGE_SIZES} from '../../constants/Soundcloud';
import {getImageUrl} from '../../utils/soundcloud';
import classnames from 'classnames';
import {truncate, abbreviate_number} from '../../utils/AppUtils';

class SongCard extends Component {

    renderArtist(track, from, info) {
        if (info && info.type == "track-repost") {
            return (
                <div className="trackArtist">
                    <a href="javascript:void(0)" title="Go to user page">
                        {
                            track.user.username
                        }
                    </a>
                    <i className="icon-retweet2"></i>
                    <a className="repost" href="javascript:void(0)"
                       title="Go to user page">{from.username}</a>

                </div>

            );
        }

        return (
            <div className="trackArtist">
                <a href="javascript:void(0)" title="Go to user page">
                    {
                        track.user.username
                    }
                </a>
            </div>
        );
    }


    render() {

        const {
            playSong,
            auth,
            dispatch,
            isPlaying,
            scrollFunc,
            track,
            from,
            info
        } = this.props;

        const image = (track.artwork_url != null) ? getImageUrl(track.artwork_url, IMAGE_SIZES.LARGE) : getImageUrl(track.user.avatar_url, IMAGE_SIZES.LARGE);

        const icon = classnames(
            {
                'icon-controller-play': !isPlaying,
                'icon-controller-pause': isPlaying
            }
        );

        const playing = classnames(
            "track",track.id,
            {
                "isPlaying": isPlaying
            }
        );

        return (
            <div className="col-xs-6 col-sm-6 col-lg-4 col-xl-s-5">
                <div className={playing}>

                    <div className="trackImage">
                        <div className="imageWrapper">
                            <img src={image}/>
                            <a className="playButton" onClick={() => playSong(track)}>
                                <i className={icon}/>
                            </a>
                            <div className="trackStats">
                                <div className="stat">
                                    <i className="icon-heart-outlined"/>
                                    <span>{abbreviate_number(track.likes_count)}</span>
                                </div>
                                <div className="stat">
                                    <i className="icon-controller-play"/>
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
                            <a href="javascript:void(0)" title="Go to track page">
                                {
                                    truncate(track.title, 35)
                                }
                            </a>
                        </div>


                        {
                            this.renderArtist(track, from, info)
                        }
                        {
                            //track.publisher_metadata.explicit ? <span className="explicit">explicit</span> : null
                        }

                    </div>
                </div>
            </div>
        );
    }
}

SongCard.propTypes = {
    playSong: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    isPlaying: PropTypes.bool.isRequired,
    scrollFunc: PropTypes.func.isRequired,
    track: PropTypes.object.isRequired,
    from: PropTypes.object.isRequired,
    info: PropTypes.object.isRequired
};

export default SongCard;