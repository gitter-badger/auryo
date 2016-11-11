// @flow
import React, {Component, PropTypes} from "react";
import ReactDOM from "react-dom";
import {appendClientId, getImageUrl} from "../../utils/soundcloudUtils";
import {getReadableTime, getPos} from "../../utils/appUtils";
import {IMAGE_SIZES} from "../../constants/Soundcloud";
import "./player.global.css";
import {CHANGE_TYPES} from "../../constants/playlist";
import {toggleStatus, changeTrack, setCurrentTime} from "../../actions";
import Sound from "../common/Sound-React";

class Player extends React.Component {

  constructor(props) {
    super(props);

    const previousVolumeLevel = Number.parseFloat(1); // TODO get volume
    this.state = {
      currentTime: 0,
      updateTime: 0,
      duration: 0,
      isSeeking: false,
      muted: false,
      repeat: false,
      shuffle: false,
      volume: previousVolumeLevel || 50,
    };

    this.changeSong = this.changeSong.bind(this);
    this.volumeClick = this.volumeClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleSeekMouseDown = this.handleSeekMouseDown.bind(this);
    this.handleSeekMouseMove = this.handleSeekMouseMove.bind(this);
    this.handleSeekMouseUp = this.handleSeekMouseUp.bind(this);
    this.handleVolumeMouseDown = this.handleVolumeMouseDown.bind(this);
    this.handleVolumeMouseMove = this.handleVolumeMouseMove.bind(this);
    this.handleVolumeMouseUp = this.handleVolumeMouseUp.bind(this);

    this.onLoad = this.onLoad.bind(this);
    this.onPlaying = this.onPlaying.bind(this);
    this.onFinishedPlaying = this.onFinishedPlaying.bind(this);

    this.progressClick = this.progressClick.bind(this);
    this.toggleMute = this.toggleMute.bind(this);
    this.togglePlay = this.togglePlay.bind(this);
    this.toggleRepeat = this.toggleRepeat.bind(this);
    this.toggleShuffle = this.toggleShuffle.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);

    // TODO get volume from config
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown, false);
  }


  handleMouseClick(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  changeSong(changeType) {
    const {dispatch} = this.props;
    dispatch(toggleStatus(Sound.status.STOPPED));
    dispatch(changeTrack(changeType));
  }


  handleKeyDown(e) {
    const key = e.keyCode || e.which;
    const matchInput = e.target.tagName.toLowerCase().match(/textarea|input/);
    if (matchInput) {
      return;
    }

    if (key === 32) {
      e.preventDefault();
      this.togglePlay();
    } else if (key === 37 || key === 74) {
      e.preventDefault();
      this.changeSong(CHANGE_TYPES.PREV);
    } else if (key === 39 || key === 75) {
      e.preventDefault();
      this.changeSong(CHANGE_TYPES.NEXT);
    }
  }

  togglePlay() {
    const {player, dispatch} = this.props;
    const {status} = player;

    if (status !== Sound.status.PLAYING) {
      dispatch(toggleStatus(Sound.status.PLAYING));
    } else if (status == Sound.status.PLAYING) {
      dispatch(toggleStatus(Sound.status.PAUSED));
    }
  }

  toggleShuffle() {
    this.setState({
      shuffle: !this.state.shuffle
    });

  }

  toggleRepeat() {
    this.setState({
      repeat: !this.state.repeat
    });
  }

  toggleMute() {
    if (!this.state.muted && this.state.volume == 0) {

      this.setState({
        volume: .5
      });
      return;
    }
    this.setState({
      muted: !this.state.muted
    });
  }

  // PROGRESS SEEK

  bindSeekMouseEvents() {
    document.addEventListener('mousemove', this.handleSeekMouseMove);
    document.addEventListener('mouseup', this.handleSeekMouseUp);
  }

  handleSeekMouseDown() {
    this.bindSeekMouseEvents();
    this.setState({
      isSeeking: true,
    });
  }

  handleSeekMouseMove(e) {
    const {dispatch, player} = this.props;
    const seekBar = ReactDOM.findDOMNode(this.refs.seekBar);

    let percent = getPos(e, seekBar);

    percent = percent > 1 ? 1 : percent < 0 ? 0 : percent;

    let currentTime = Math.floor(percent * this.state.duration);

    this.setState({
      currentTime: currentTime
    });

  }

  handleSeekMouseUp() {
    if (!this.state.isSeeking) {
      return;
    }

    document.removeEventListener('mousemove', this.handleSeekMouseMove);
    document.removeEventListener('mouseup', this.handleSeekMouseUp);
    const {dispatch, player} = this.props;

    dispatch(setCurrentTime(this.state.currentTime));

    this.setState({
      isSeeking: false,
      updateTime: this.state.currentTime
    });
  }

  progressClick(e) {
    const {dispatch} = this.props;

    const percent = getPos(e);

    let currentTime = Math.floor(percent * this.state.duration);

    if (currentTime > this.state.duration) {
      currentTime = this.state.duration;
    }

    this.setState({
      updateTime: currentTime,
      currentTime: currentTime
    });

    dispatch(setCurrentTime(currentTime));
  }


  // VOLUME SEEK


  bindVolumeMouseEvents() {
    document.addEventListener('mousemove', this.handleVolumeMouseMove);
    document.addEventListener('mouseup', this.handleVolumeMouseUp);
  }

  handleVolumeMouseDown() {
    this.bindVolumeMouseEvents();
    this.setState({
      isSeeking: true,
    });
  }

  handleVolumeMouseMove(e) {
    const volumeBar = ReactDOM.findDOMNode(this.refs.volumeBar);

    let percent = getPos(e, volumeBar);

    percent = percent > 1 ? 1 : percent < 0 ? 0 : percent;
    this.setState({
      volume: percent,
    });
  }

  handleVolumeMouseUp() {
    if (!this.state.isSeeking) {
      return;
    }

    document.removeEventListener('mousemove', this.handleVolumeMouseMove);
    document.removeEventListener('mouseup', this.handleVolumeMouseUp);

    this.setState({
      isSeeking: false,
    });
    // Todo write to config
  }

  volumeClick(e) {
    this.setState({
      muted: false
    });

    let percent = getPos(e);

    percent = percent > 1 ? 1 : percent < 0 ? 0 : percent;

    this.setState({
      volume: percent
    })
  }

  // RENDER

  renderProgressBar() {
    const {player} = this.props;
    const {duration, currentTime} = this.state;

    const time = (this.state.isSeeking) ? currentTime : player.currentTime;

    if (duration !== 0) {
      const width = time / duration * 100;
      return (
        <div
          className="currentTime"
          style={{width: `${width}%`}}>
          <div
            className="handle"
          />
        </div>
      );
    }

    return null;
  }

  renderVolumeBar() {
    const {muted, volume} = this.state;
    const width = muted ? 0 : volume * 100;
    return (
      <div
        className="currentTime"
        style={{width: `${width}%`}}>
        <div
          className="handle"
          onClick={this.handleMouseClick}
          onMouseDown={this.handleVolumeMouseDown}
        />
      </div>
    );
  }

  // PLAYER LISTENERS

  onLoad(obj) {
    this.setState({
      currentTime: 0,
      updateTime: 0,
      duration: obj.duration
    });
  }

  onPlaying(obj) {
    if (this.state.isSeeking) return;
    const {dispatch} = this.props;
    this.setState({
      currentTime: obj.position
    });

    dispatch(setCurrentTime(obj.position));
  }

  onFinishedPlaying(obj) {
    const {dispatch} = this.props;

    dispatch(changeTrack(this.state.shuffle ? CHANGE_TYPES.SHUFFLE : CHANGE_TYPES.NEXT));
  }

  // ====

  render() {
    const {player, users, playingSongId, playlists, tracks} = this.props;
    const {status} = player;
    const track = tracks[playingSongId];
    const prevFunc = this.changeSong.bind(this, CHANGE_TYPES.PREV);
    const nextFunc = this.changeSong.bind(
      this,
      this.state.shuffle ? CHANGE_TYPES.SHUFFLE : CHANGE_TYPES.NEXT
    );

    const image = (track.artwork_url != null) ? getImageUrl(track.artwork_url, IMAGE_SIZES.SMALL) : getImageUrl(track.user.avatar_url, IMAGE_SIZES.SMALL);
    let overlay_image = (track.artwork_url != null) ? getImageUrl(track.artwork_url, IMAGE_SIZES.XLARGE) : getImageUrl(track.user.avatar_url, IMAGE_SIZES.XLARGE);

    const toggle_play_icon = status == Sound.status.PLAYING ? 'pause' : 'play_arrow';
    const volume_icon = this.state.muted || this.state.volume == 0 ? "volume_off" : (this.state.volume == 1) ? "volume_up" : "volume_down";

    return (
      <div id="player">
        <div className="imgOverlay">
          <img src={overlay_image}/>
        </div>

        <Sound
          url={appendClientId(track.stream_url)}
          playStatus={status}
          volume={this.state.volume * 100}
          playFromPosition={this.state.updateTime}
          muted={this.state.muted}
          id={playingSongId}

          onLoading={this.onLoad}
          onPlaying={this.onPlaying}
          onFinishedPlaying={this.onFinishedPlaying}/>

        <div className="flex playerInner">
          <div className="playerAlbum">
            <img width={50} height={50} src={image}/>
          </div>
          <div id="playerControls">
            <a href="javascript:void(0)" onClick={prevFunc}><i className="material-icons">skip_previous</i></a>

            <a href="javascript:void(0)" onClick={this.togglePlay}><i className="material-icons">{toggle_play_icon}</i></a>

            <a href="javascript:void(0)" onClick={nextFunc}><i className="material-icons">skip_next</i></a>
          </div>
          <div id="playerTimeLine" className="col-xs-5 col-lg-6 col-xl-8">
            <div
              className="time">{getReadableTime(this.state.currentTime)}</div>
            <div className="time">{getReadableTime(this.state.duration)}</div>

            <div className="wrapper">
              <div className="inner"
                   onClick={this.progressClick}
                   onMouseDown={this.handleSeekMouseDown}>
                <div className="player-progress" ref="seekBar">
                  {
                    this.renderProgressBar()
                  }
                </div>
              </div>
            </div>

          </div>
          <div id="playerVolume" className="col-xs-2 col-lg-2 col-xl-1 flex">
            <i className="material-icons" onClick={this.toggleMute}>{volume_icon}</i>
            <div className="wrapper">
              <div className="inner" onClick={this.volumeClick}
                   onMouseDown={this.handleVolumeMouseDown}>
                <div className="player-progress" ref="volumeBar">
                  {
                    this.renderVolumeBar()
                  }
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

}


Player.propTypes = {
  dispatch: PropTypes.func.isRequired,
  player: PropTypes.object.isRequired,
  playingSongId: PropTypes.string,
  playlists: PropTypes.object.isRequired,
  song: PropTypes.object,
  tracks: PropTypes.object.isRequired,
  users: PropTypes.object.isRequired,
};

export default Player;
