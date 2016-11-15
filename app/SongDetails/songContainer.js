import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {fetchTrackIfNeeded, playTrack, toggleLike} from "../common/actions";
import Spinner from "../common/components/Spinner/index";
import {IMAGE_SIZES} from "../common/constants/Soundcloud";
import {getImageUrl, formatDescription} from "../common/utils/soundcloudUtils";
import {abbreviate_number} from "../common/utils/appUtils";
import {getPlayingTrackId} from "../Player/playerUtils";
import styles from "./song.css";
import TogglePlay from "../common/components/togglePlay";
import cn from "classnames";
import {RELATED_PLAYLIST} from "../common/constants/playlist";


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
      return <TogglePlay classname={styles.playButton}/>;
    }

    const playTrackFunc = this.playTrack.bind(this, 0);

    return (

      <a className={styles.playButton} onClick={playTrackFunc}>
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
      <div className="scroll">
        <div className="container-fluid">
          <div className={`row ${styles.trackHeader}`}>

            <div className={styles.overlayWrapper}>
              <img className={styles.overlayImg} src={img_url}/>
            </div>

            <div className="col-xs-12 col-md-4 col-lg-4">
              <div className={styles.imageWrapper}>
                <img src={img_url}/>
                <img className={styles.imgShadow} src={img_url}/>
              </div>
            </div>
            <div className={cn("col-xs-12 col-md-8 col-lg-8", styles.trackInfo)}>
              <div className={styles.trackTitle}>{track.title}</div>
              <div className={styles.trackArtist}>{user.username}</div>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 col-md-4">
              <div className={`flex flex-items-xs-center ${styles.trackStats}`}>
                <div className={styles.stat}>
                  <i className="icon-favorite_border"/>
                  <span>{abbreviate_number(track.favoritings_count)}</span>
                </div>
                <div className={styles.stat}>
                  <i className="icon-play_arrow"/>
                  <span>{abbreviate_number(track.playback_count)}</span>
                </div>
                <div className={styles.stat}>
                  <i className="icon-chat_bubble"/>
                  <span>{abbreviate_number(track.comment_count)}</span>
                </div>
              </div>
            </div>
            <div className="col-xs-12 col-md-8">
              <div className={`flex ${styles.trackActions}`}>
                {
                  this.renderToggleButton()
                }
                <a className={cn(styles.c_btn, {[styles.liked]: liked})} onClick={likeFunc}>
                  <i className={ liked ? "icon-favorite" : "icon-favorite_border" }/>
                  <span>Like</span>
                </a>
                <a className={styles.c_btn}>
                  <i className="icon-retweet"/>
                  <span>Repost</span>
                </a>
                <a className={styles.c_btn}>
                  <i className="icon-add"/>
                  <span>Add to playlist</span>
                </a>
              </div>

              <div className={cn(styles.trackDescription, {[styles.isOpen]: this.state.open})}>
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
