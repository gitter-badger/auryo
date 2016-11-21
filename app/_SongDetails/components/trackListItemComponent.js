import React, {Component, PropTypes} from "react";
import TogglePlayButton from "../../_common/components/togglePlay";
import {Link} from "react-router";
import {truncate,getReadableTime} from "../../_common/utils/appUtils";
import cn from "classnames";
import {Row, Col} from "reactstrap";


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

      <a className="toggleButton" onClick={playTrackFunc}>
        <i className={`icon-${icon}`}/>
      </a>
    );
  }

  render() {
    const {track, users, isPlaying, liked, likeFunc} = this.props;


    const user = users[track.user_id];

    return (
      <Row className={cn("trackItem", {isPlaying: isPlaying})}>
        <Col xs="6" className="flex">
          {
            this.renderToggleButton()
          }
          <div className="trackTitle">
            <Link to={`/song/${track.id}`}>
              {
                truncate(track.title, 80, "...", true)
              }
            </Link>
          </div>
        </Col>
        <Col xs="4" className="trackArtist">
          {user.username}
        </Col>
        <div className="col-xs">
          {getReadableTime(track.duration,true)}
        </div>
        <div className="trackitemActions col-xs">
          <a className={cn({liked: liked})} href="javascript:void(0)" onClick={likeFunc}>
            <i className={liked ? "icon-favorite" : "icon-favorite_border"}/>
          </a>
          {/*<i className="icon-retweet"/>
           <i className="icon-playlist_add"/>*/}
        </div>
      </Row>
    );
  }
}

trackListItem.propTypes = {
  playTrackFunc: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  track: PropTypes.object.isRequired,
  users: PropTypes.object.isRequired,
  likeFunc: PropTypes.func.isRequired,
  liked: PropTypes.bool.isRequired
};


export default trackListItem;
