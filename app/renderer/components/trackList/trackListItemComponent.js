import React, {Component, PropTypes} from "react";
import cn from "classnames";
import {Link} from "react-router";

import {truncate, getReadableTime} from "../../utils";

import TogglePlayButton from "../togglePlayComponent";

import "../../assets/css/songDetails/trackListItem.scss"

class trackListItem extends Component {

    constructor(props) {
        super(props);

        this.renderToggleButton = this.renderToggleButton.bind(this);
    }

    renderToggleButton() {
        const {isPlaying, playTrackFunc} = this.props;

        if (isPlaying) {
            return <TogglePlayButton classname={"toggleButton"}/>;
        }
        const icon = isPlaying ? 'pause' : 'play_arrow';

        return (

            <a href="javascript:void(0)" className="toggleButton" onClick={playTrackFunc.bind(null, true)}>
                <i className={`icon-${icon}`}/>
            </a>
        );
    }

    render() {
        const {
            track,
            user_entities,
            isPlaying,
            liked,
            likeFunc,
            playTrackFunc
        } = this.props;

        const user = user_entities[track.user_id];

        return (
            <tr className={cn("trackItem", {isPlaying: isPlaying})} onDoubleClick={playTrackFunc.bind(null, false)}>
                <td>
                    {
                        this.renderToggleButton()
                    }
                </td>
                <td className="flex">
                    <div className="trackTitle">
                        <Link to={`/song/${track.id}`}>
                            {
                                truncate(track.title, 80, "...", true)
                            }
                        </Link>
                    </div>
                </td>

                <td className="trackArtist">
                    {user.username}
                </td>
                <td className="text-xs-center">
                    {getReadableTime(track.duration, true)}
                </td>
                <td className="trackitemActions">
                    <a className={cn({liked: liked})} href="javascript:void(0)" onClick={likeFunc}>
                        <i className={liked ? "icon-favorite" : "icon-favorite_border"}/>
                    </a>
                    {/*<i className="icon-retweet"/>
                     <i className="icon-playlist_add"/>*/}
                </td>
            </tr>
        );
    }
}

trackListItem.propTypes = {
    playTrackFunc: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    isPlaying: PropTypes.bool.isRequired,
    track: PropTypes.object.isRequired,
    user_entities: PropTypes.object.isRequired,
    likeFunc: PropTypes.func.isRequired,
    liked: PropTypes.bool.isRequired
};


export default trackListItem;
