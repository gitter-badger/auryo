import React, {Component, PropTypes} from "react";
import TogglePlayButton from "../../_common/components/togglePlay";
import {Link} from "react-router";
import {truncate,filter} from "../../_common/utils/appUtils";

import {Row,Container,Col} from "reactstrap";


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
    const {track, user, isPlaying} = this.props;


    return (
      <Row className="trackItem flex">
        <Col xs="6" className="flex">
          {
            this.renderToggleButton()
          }
          <div className="trackTitle">
            <Link to={`/song/${track.id}`}>
              {
                filter(truncate(track.title,80))
              }
            </Link>
          </div>
        </Col>
        <Col xs="4" className="trackArtist">
          {track.user.username}
        </Col>
        <Col xs="2">
          <i className="icon-favorite_border"/>
          <i className="icon-retweet" />
          <i className="icon-playlist_add" />
        </Col>
      </Row>
    );
  }
}

trackListItem.propTypes = {
  playTrackFunc: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  track: PropTypes.object.isRequired,
};


export default trackListItem;
