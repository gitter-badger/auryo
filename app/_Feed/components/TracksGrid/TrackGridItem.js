import React, {Component, PropTypes} from "react";
import {Link} from "react-router";
import {IMAGE_SIZES} from "../../../_common/constants/Soundcloud";
import {getImageUrl} from "../../../_common/utils/soundcloudUtils";
import classnames from "classnames";
import {truncate, abbreviate_number} from "../../../_common/utils/appUtils";
import TogglePlayButton from "../../../_common/components/togglePlay";
import {Col} from "reactstrap";
import FallbackImage from "../../../_common/components/FallbackImageComponent"

class TrackGridItem extends Component {

    renderArtist(track) {
        if (track.activity_type && track.activity_type == "track-repost") {
            return (
                <div className="trackArtist">
                    <a href="javascript:void(0)" title="Go to user page">
                        {
                            track.user.username
                        }
                    </a>
                    <i className="icon-retweet"/>
                    <a className="repost" href="javascript:void(0)"
                       title="Go to user page">{track.from_user.username}</a>

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

    renderToggleButton() {
        const {isPlaying, playTrackFunc} = this.props;

        if (isPlaying) {
            return <TogglePlayButton classname={"toggleButton"}/>;
        }

        const icon = isPlaying ? 'pause' : 'play_arrow';

        return (

            <a className="toggleButton" onClick={playTrackFunc}>
                <i className={`icon-${icon}`}/>
            </a>
        );
    }


    render() {

        const {
            isPlaying,
            track,
            dispatch
        } = this.props;


        const image = getImageUrl(track, IMAGE_SIZES.LARGE);

        const playing = classnames(
            "track", track.id,
            {
                "isPlaying": isPlaying
            }
        );

        return (
            <Col xs="12" sm="6" lg="4" className="trackWrapper">
                <div className={playing}>

                    <div className="trackImage">
                        <div className="imageWrapper">
                            <FallbackImage dispatch={dispatch} track_id={track.id} src={image}/>
                            {
                                this.renderToggleButton()
                            }
                            <div className="trackStats">
                                <div className="stat">
                                    <i className="icon-favorite_border"/>
                                    <span>{abbreviate_number(track.likes_count)}</span>
                                </div>
                                <div className="stat">
                                    <i className="icon-retweet"/>
                                    <span>{abbreviate_number(track.reposts_count)}</span>
                                </div>
                            </div>
                        </div>
                        {
                            track.genre ? <a className="trackGenre">{track.genre}</a> : null
                        }

                    </div>

                    <div className="trackInfo">
                        <div className="trackTitle">
                            <Link to={`/song/${(track.track_id) ? track.track_id : track.id}`}>
                                {
                                    truncate(track.title, 35)
                                }
                            </Link>
                        </div>


                        {
                            this.renderArtist(track)
                        }
                        {
                            //track.publisher_metadata.explicit ? <span className="explicit">explicit</span> : null
                        }

                    </div>
                </div>
            </Col>
        );
    }
}

TrackGridItem.propTypes = {
    playTrackFunc: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    isPlaying: PropTypes.bool.isRequired,
    track: PropTypes.object.isRequired,
};

export default TrackGridItem;
