// @flow
import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {toggleIsPlaying, changeCurrentTime,changeSong} from '../../actions'
import {appendClientId, getImageUrl} from '../../utils/soundcloud';
import {IMAGE_SIZES} from '../../constants/Soundcloud'
import "./player.global.css"
import {CHANGE_TYPES} from "../../constants/playlist"

class Player extends React.Component {

  constructor(props) {
    super(props);
    this.onPlay = this.onPlay.bind(this);
    this.onPause = this.onPause.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.handleLoadedMetadata = this.handleLoadedMetadata.bind(this);
    this.handleLoadStart = this.handleLoadStart.bind(this);
    this.handleTimeUpdate = this.handleTimeUpdate.bind(this);
    this.handleVolumeChange = this.handleVolumeChange.bind(this);
    this.togglePlay = this.togglePlay.bind(this);

    this.state = {
      currentTime: 0,
      duration: 0,
      muted: false,
      repeat: false,
      shuffle: false,
      isSeeking:false
    }
  }

  componentDidMount() {
    const audioElement = ReactDOM.findDOMNode(this.refs.audio);


    audioElement.addEventListener('ended', this.onEnd, false);
    audioElement.addEventListener('loadedmetadata', this.handleLoadedMetadata, false);
    audioElement.addEventListener('loadstart', this.handleLoadStart, false);
    audioElement.addEventListener('pause', this.onPause, false);
    audioElement.addEventListener('play', this.onPlay, false);
    audioElement.addEventListener('timeupdate', this.handleTimeUpdate, false);
    audioElement.addEventListener('volumechange', this.handleVolumeChange, false);
    audioElement.play();
  }

  componentWillUnmount() {
    const audioElement = ReactDOM.findDOMNode(this.refs.audio);


    audioElement.removeEventListener('ended', this.onEnd, false);
    audioElement.removeEventListener('loadedmetadata', this.handleLoadedMetadata, false);
    audioElement.removeEventListener('loadstart', this.handleLoadStart, false);
    audioElement.removeEventListener('pause', this.onPause, false);
    audioElement.removeEventListener('play', this.onPlay, false);
    audioElement.removeEventListener('timeupdate', this.handleTimeUpdate, false);
    audioElement.removeEventListener('volumechange', this.handleVolumeChange, false);

  }

  togglePlay() {
    const {isPlaying} = this.props.player;
    const audioElement = ReactDOM.findDOMNode(this.refs.audio);
    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play();
    }
  }

  handleVolumeChange() {
  }

  onPlay() {
    const {dispatch} = this.props;
    dispatch(toggleIsPlaying(true));
  }

  onPause() {
    const {dispatch} = this.props;
    dispatch(toggleIsPlaying(false));
  }

  handleLoadStart() {
    const {dispatch} = this.props;
    dispatch(changeCurrentTime(0));
    this.setState({
      duration: 0,
    });
  }

  handleLoadedMetadata() {
    const audioElement = ReactDOM.findDOMNode(this.refs.audio);
    this.setState({
      duration: Math.floor(audioElement.duration),
    });
  }

  onEnd() {
    if (this.state.repeat) {
      ReactDOM.findDOMNode(this.refs.audio).play();
    } else if (this.state.shuffle) {
      this.changeSong(CHANGE_TYPES.SHUFFLE);
    } else {
      this.changeSong(CHANGE_TYPES.NEXT);
    }
  }

  handleTimeUpdate(e) {
    if (this.state.isSeeking) {
      return;
    }

    const { dispatch, player } = this.props;
    const audioElement = e.currentTarget;
    const currentTime = Math.floor(audioElement.currentTime);

    if (currentTime === player.currentTime) {
      return;
    }

    dispatch(changeCurrentTime(currentTime));
  }

  changeSong(changeType) {
    const { dispatch } = this.props;
    dispatch(changeSong(changeType));
  }

  componentDidUpdate(prevProps) {
    if (prevProps.playingSongId && prevProps.playingSongId === this.props.playingSongId) {
      return;
    }

    ReactDOM.findDOMNode(this.refs.audio).play();
  }

  renderDurationBar() {
    const { currentTime } = this.props.player;
    const { duration } = this.state;

    if (duration !== 0) {
      const width = currentTime / duration * 100;
      return (
        <div
          className="currentTime"
          style={{ width: `${width}%` }}
        >
          <div
            className="handle"
            onClick={this.handleMouseClick}
            onMouseDown={this.handleSeekMouseDown}
          />
        </div>
      );
    }

    return null;
  }

  render() {
    const {player, users, playingSongId, playlists, tracks} = this.props;
    const {isPlaying} = player;
    const track = tracks[playingSongId];
    const prevFunc = this.changeSong.bind(this, CHANGE_TYPES.PREV);
    const nextFunc = this.changeSong.bind(
      this,
      this.state.shuffle ? CHANGE_TYPES.SHUFFLE : CHANGE_TYPES.NEXT
    );

    const image = (track.artwork_url != null) ? getImageUrl(track.artwork_url, IMAGE_SIZES.SMALL) : getImageUrl(track.user.avatar_url, IMAGE_SIZES.SMALL);
    let overlay_image = (track.artwork_url != null) ? getImageUrl(track.artwork_url, IMAGE_SIZES.XLARGE) : getImageUrl(track.user.avatar_url, IMAGE_SIZES.XLARGE);

    const icon = isPlaying ? 'pause' : 'play_arrow';

    return (
      <div id="player">
        <div className="imgOverlay">
          <img src={overlay_image}/>
        </div>
        <audio id="audio" ref="audio" src={appendClientId(track.stream_url)}/>
        <div className="flex playerInner">
          <div className="playerAlbum">
            <img width={60} height={60} src={image}/>
          </div>
          <div id="playerControls">
            <a href="javascript:void(0)" onClick={prevFunc}><i className="material-icons">skip_previous</i></a>

            <a href="javascript:void(0)" onClick={this.togglePlay}><i className="material-icons">{icon}</i></a>

            <a href="javascript:void(0)" onClick={nextFunc}><i className="material-icons">skip_next</i></a>
          </div>
          <div id="playerTimeLine">
            {
              this.renderDurationBar()
            }
          </div>
        </div>
      </div>
    );
  }

}


Player.propTypes = {
  dispatch: PropTypes.func.isRequired,
  player: PropTypes.object.isRequired,
  playingSongId: PropTypes.number,
  playlists: PropTypes.object.isRequired,
  song: PropTypes.object,
  tracks: PropTypes.object.isRequired,
  users: PropTypes.object.isRequired,
};

export default Player;
