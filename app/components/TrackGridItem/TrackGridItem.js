import React, {Component, PropTypes} from "react";
import {IMAGE_SIZES} from "../../constants/Soundcloud";
import {getImageUrl} from "../../utils/soundcloudUtils";
import classnames from "classnames";
import {truncate, abbreviate_number} from "../../utils/appUtils";
import TogglePlayButtonfrom from "../../components/togglePlay";

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
          <i className="icon-retweet2"></i>
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
      return <TogglePlayButtonfrom />;
    }

    const icon = isPlaying ? 'icon-controller-paus' : 'icon-controller-play';

    return (

      <a className="playButton" onClick={playTrackFunc}>
        <i className={icon}/>
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

    let image = (track.artwork_url != null) ? getImageUrl(track.artwork_url, IMAGE_SIZES.LARGE) : getImageUrl(track.user.avatar_url, IMAGE_SIZES.LARGE);


    const playing = classnames(
      "track", track.id,
      {
        "isPlaying": isPlaying
      }
    );

    return (
      <div className="col-xs-12 col-sm-6 col-lg-4 col-xl-s-5">
        <div className={playing}>

          <div className="trackImage">
            <div className="imageWrapper">
              <img src={image}/>
              {
                this.renderToggleButton()
              }
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
