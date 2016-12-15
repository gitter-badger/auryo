import React, {Component, PropTypes} from "react";
import {Link} from "react-router";
import {IMAGE_SIZES} from "../../../_shared/constants/Soundcloud";
import {getImageUrl} from "../../../_shared/utils/soundcloudUtils";
import classnames from "classnames";
import {truncate, abbreviate_number} from "../../../_shared/utils/appUtils";
import TogglePlayButton from "../../../_shared/components/togglePlay";
import {Col} from "reactstrap";
import FallbackImage from "../../../_shared/components/FallbackImageComponent";
import "../../../assets/css/Feed/trackgriditem.scss"

class TrackGridItem extends Component {

    renderArtist(track) {


        if (track.activity_type && track.activity_type == "track-repost") {
            return (
                <div className="trackArtist">
                    <Link to={`/artist/${track.user.id}`}>
                        {
                            track.user.username
                        }
                    </Link>
                    <i className="icon-retweet"/>

                    <Link to={`/artist/${track.from_user.id}`} className="repost">
                        {track.from_user.username}
                    </Link>

                </div>

            );
        }

        return (
            <div className="trackArtist">
                <Link to={`/artist/${track.user.id}`}>
                    {track.user.username}
                </Link>
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
            dispatch,
            app
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
                            <FallbackImage
                                dispatch={dispatch}
                                track_id={track.id}
                                offline={app.offline}
                                src={image}/>
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


                    </div>
                </div>
            </Col>
        );
    }
}

TrackGridItem.propTypes = {
    playTrackFunc: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    isPlaying: PropTypes.bool.isRequired,
    track: PropTypes.object.isRequired,
    app: PropTypes.object.isRequired,
};

export default TrackGridItem;
