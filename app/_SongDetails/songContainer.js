import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {fetchTrackIfNeeded, playTrack, toggleLike} from "../_common/actions";
import Spinner from "../_common/components/Spinner/index";
import {IMAGE_SIZES} from "../_common/constants/Soundcloud";
import {getImageUrl, formatDescription} from "../_common/utils/soundcloudUtils";
import {abbreviate_number} from "../_common/utils/appUtils";
import {getPlayingTrackId} from "../_Player/playerUtils";
import TogglePlay from "../_common/components/togglePlay";
import cn from "classnames";
import {RELATED_PLAYLIST} from "../_common/constants/playlist";
import "./song.scss";


class songContainer extends Component {

  constructor(props) {
    super(props);

    this.toggleOpen = this.toggleOpen.bind(this);
    this.state = {
      open: false
    };
  }

  componentWillMount() {
    const {dispatch, params} = this.props;
    dispatch(fetchTrackIfNeeded(params.songId));
  }


  playTrack(i, e) {
    e.preventDefault();
    const {dispatch, params} = this.props;
    const current_playlist = params.songId + RELATED_PLAYLIST;
    dispatch(playTrack(i, current_playlist));
  }

  renderToggleButton() {
    const {params, playingSongId} = this.props;

    if (playingSongId == params.songId) {
      return <TogglePlay classname="playButton"/>;
    }

    const playTrackFunc = this.playTrack.bind(this, 0);

    return (

      <a className="playButton" onClick={playTrackFunc}>
        <i className="icon-play_arrow"/>
      </a>
    );
  }

  toggleOpen() {
    this.setState({
      open: !this.state.open
    })
  }

  toggleLike(trackID, e) {
    e.preventDefault();
    const {dispatch} = this.props;

    dispatch(toggleLike(trackID));
  }

  render() {
    const {tracks, params, users, likes} = this.props;

    const track = tracks[params.songId];

    if (!track) {
      return <Spinner />
    }

    const img_url = getImageUrl(track, IMAGE_SIZES.LARGE);
    const user = users[track.user_id];

    const likeFunc = this.toggleLike.bind(this, track.id);
    const liked = (track.id in likes) && likes[track.id] == 1;

    return (
      <div className="scroll trackDetails">
        <div className="container-fluid">
          <div className="row trackHeader">

            <div className="overlayWrapper">
              <img className="overlayImg" src={img_url}/>
            </div>

            <div className="col-xs-12 col-md-4 col-lg-4">
              <div className="imageWrapper">
                <img src={img_url}/>
                <img className="imgShadow" src={img_url}/>
              </div>
            </div>
            <div className="col-xs-12 col-md-8 col-lg-8 trackInfo">
              <div className="trackTitle">{track.title}</div>
              <div className="trackArtist">{user.username}</div>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 col-md-4">
              <div className="flex flex-items-xs-center trackStats">
                <div className="stat">
                  <i className="icon-favorite_border"/>
                  <span>{abbreviate_number(track.favoritings_count)}</span>
                </div>
                <div className="stat">
                  <i className="icon-play_arrow"/>
                  <span>{abbreviate_number(track.playback_count)}</span>
                </div>
                <div className="stat">
                  <i className="icon-chat_bubble"/>
                  <span>{abbreviate_number(track.comment_count)}</span>
                </div>
              </div>
            </div>
            <div className="col-xs-12 col-md-8">
              <div className="flex trackActions">
                {
                  this.renderToggleButton()
                }
                <a className={cn("c_btn", {liked: liked})} onClick={likeFunc}>
                  <i className={ liked ? "icon-favorite" : "icon-favorite_border" }/>
                  <span>Like</span>
                </a>
                <a className="c_btn">
                  <i className="icon-retweet"/>
                  <span>Repost</span>
                </a>
                <a className="c_btn">
                  <i className="icon-add"/>
                  <span>Add to playlist</span>
                </a>
              </div>

              <div className={cn("trackDescription", {isOpen: this.state.open})}>
                <div dangerouslySetInnerHTML={formatDescription(track.description)}></div>
                {
                  (this.state.open) ? <a onClick={this.toggleOpen}>read less</a> :
                    <a onClick={this.toggleOpen}>read more</a>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const {entities, player, playlists, user} = state;
  const {tracks, users} = entities;
  const {likes} = user;
  const playingSongId = getPlayingTrackId(player, playlists);
  return {
    tracks,
    users,
    player,
    playingSongId,
    likes
  }
}

export default connect(mapStateToProps)(songContainer);
