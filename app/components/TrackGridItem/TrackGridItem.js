import React, {Component, PropTypes} from "react";
import {Link} from "react-router";
import {IMAGE_SIZES} from "../../constants/Soundcloud";
import {getImageUrl} from "../../utils/soundcloudUtils";
import classnames from "classnames";
import {truncate, abbreviate_number} from "../../utils/appUtils";
import togglePlay from "../../components/togglePlay";
import "./trackgriditem.global.css"

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
          <i className="material-icons">repeat</i>
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
      return <togglePlay />;
    }

    const icon = isPlaying ? 'pause' : 'play_arrow';

    return (

      <a className="playButton" onClick={playTrackFunc}>
        <i className="material-icons">{icon}</i>
      </a>
    );
  }


  render() {

    const {
      playTrackFunc,
      user,
      dispatch,
      isPlaying,
      scrollFunc,
      track,
    } = this.props;


    const image = getImageUrl(track, IMAGE_SIZES.LARGE);

    const playing = classnames(
      "track", track.id,
      {
        "isPlaying": isPlaying
      }
    );

    return (
      <div className="col-xs-12 col-sm-6 col-lg-4 col-xl-s-5" style={{height: "360px"}}>
        <div className={playing}>

          <div className="trackImage">
            <div className="imageWrapper">
              <img src={image}/>
              {
                this.renderToggleButton()
              }
              <div className="trackStats">
                <div className="stat">
                  <i className="material-icons">favorite_border</i>
                  <span>{abbreviate_number(track.likes_count)}</span>
                </div>
                <div className="stat">
                  <i className="material-icons">repeat</i>
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
      </div>
    );
  }
}

TrackGridItem.propTypes = {
  playTrackFunc: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  scrollFunc: PropTypes.func.isRequired,
  track: PropTypes.object.isRequired,
};

export default TrackGridItem;
