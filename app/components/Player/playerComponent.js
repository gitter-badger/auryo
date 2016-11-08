// @flow
import React, {Component, PropTypes} from "react";
import ReactDOM from "react-dom";
import {appendClientId, getImageUrl} from "../../utils/soundcloudUtils";
import {getReadableTime, offsetLeft} from "../../utils/appUtils";
import {IMAGE_SIZES} from "../../constants/Soundcloud";
import "./player.global.css";
import {CHANGE_TYPES} from "../../constants/playlist";
import {toggleStatus, changeTrack, setCurrentTime} from "../../actions";
import Sound from "react-sound";

class Player extends React.Component {

  constructor(props) {
    super(props);

    const previousVolumeLevel = Number.parseFloat(1); // TODO get volume
    this.state = {
      currentTime: 0,
      updateTime:0,
      duration: 0,
      isSeeking: false,
      muted: false,
      repeat: false,
      shuffle: false,
      volume: previousVolumeLevel || 50,
    };

    this.changeSong = this.changeSong.bind(this);
    this.changeVolume = this.changeVolume.bind(this);
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

  componentDidUpdate(prevProps) {
    /*if (prevProps.playingSongId && prevProps.playingSongId === this.props.playingSongId) {
     return;
     }

     ReactDOM.findDOMNode(this.refs.audio).play();*/
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown, false);
  }

  onTimeUpdate(e) {
    if (this.state.isSeeking) {
      return;
    }

    const {dispatch, player} = this.props;
    const audioElement = e.currentTarget;
    const currentTime = Math.floor(audioElement.currentTime);

    if (currentTime === player.currentTime) {
      return;
    }

    dispatch(setCurrentTime(currentTime));
  }

  onVolumeChange(e) {
    if (this.state.isSeeking) {
      return;
    }

    const volume = e.currentTarget.volume;
    // Todo Write to config
    this.setState({
      volume,
    });
  }


  bindVolumeMouseEvents() {
    document.addEventListener('mousemove', this.handleVolumeMouseMove);
    document.addEventListener('mouseup', this.handleVolumeMouseUp);
  }

  changeSong(changeType) {
    const {dispatch} = this.props;
    dispatch(toggleStatus(Sound.status.STOPPED));
    dispatch(changeTrack(changeType));
  }

  changeVolume(e) {
    const audioElement = ReactDOM.findDOMNode(this.refs.audio);
    audioElement.volume = (e.clientX - offsetLeft(e.currentTarget)) / e.currentTarget.offsetWidth;
  }

  handleMouseClick(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  // SEEK
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

    var box = seekBar.getBoundingClientRect();
    const start = box.left;

    let percent = (e.clientX - start ) / box.width;
    percent = percent > 1 ? 1 : percent < 0 ? 0 : percent;

    let currentTime = Math.floor(percent * this.state.duration);

    this.setState({
      currentTime: currentTime
    })

  }

  handleSeekMouseUp() {
    if (!this.state.isSeeking) {
      return;
    }

    document.removeEventListener('mousemove', this.handleSeekMouseMove);
    document.removeEventListener('mouseup', this.handleSeekMouseUp);
    const {dispatch, player} = this.props;

    //dispatch(setCurrentTime(this.state.currentTime));

    this.setState({
      isSeeking: false,
      updateTime: this.state.currentTime
    });
  }


  handleVolumeMouseDown() {
    this.bindVolumeMouseEvents();
    this.setState({
      isSeeking: true,
    });
  }

  handleVolumeMouseMove(e) {
    const volumeBar = ReactDOM.findDOMNode(this.refs.volumeBar);
    const diff = e.clientX - offsetLeft(volumeBar);
    const pos = diff < 0 ? 0 : diff;
    let percent = pos / volumeBar.offsetWidth;
    percent = percent > 1 ? 1 : percent;

    this.setState({
      volume: percent,
    });
    ReactDOM.findDOMNode(this.refs.audio).volume = percent;
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

  handleKeyDown(e) {
    const keyCode = e.keyCode || e.which;
    const isInsideInput = e.target.tagName.toLowerCase().match(/input|textarea/);
    if (isInsideInput) {
      return;
    }

    if (keyCode === 32) {
      e.preventDefault();
      this.togglePlay();
    } else if (keyCode === 37 || keyCode === 74) {
      e.preventDefault();
      this.changeSong(CHANGE_TYPES.PREV);
    } else if (keyCode === 39 || keyCode === 75) {
      e.preventDefault();
      this.changeSong(CHANGE_TYPES.NEXT);
    }
  }

  progressClick(e) {
    const {dispatch} = this.props;
    let el = e.currentTarget;

    var box = el.getBoundingClientRect();
    const start = box.left;

    const percent = (e.clientX - start ) / box.width;
    let currentTime = Math.floor(percent * this.state.duration);

    if (currentTime > this.state.duration) {
      currentTime = this.state.duration;
    }

    this.setState({
      updateTime: currentTime,
      currentTime: currentTime
    });

    //dispatch(setCurrentTime(currentTime));
  }

  toggleMute() {
    const audioElement = ReactDOM.findDOMNode(this.refs.audio);
    if (this.state.muted) {
      audioElement.muted = false;
    } else {
      audioElement.muted = true;
    }

    this.setState({muted: !this.state.muted});
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

  toggleRepeat() {
    this.setState({repeat: !this.state.repeat});
  }

  toggleShuffle() {
    this.setState({shuffle: !this.state.shuffle});
  }

  renderProgress() {
    const {} = this.props.player;
    const {duration,currentTime} = this.state;

    if (duration !== 0) {
      const width = currentTime / duration * 100;
      return (
        <div
          className="currentTime"
          style={{width: `${width}%`}}
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

  renderVolumeBar() {
    const {muted, volume} = this.state;
    const width = muted ? 0 : volume * 100;
    return (
      <div
        className="player-seek-duration-bar"
        style={{width: `${width}%`}}
      >
        <div
          className="player-seek-handle"
          onClick={this.handleMouseClick}
          onMouseDown={this.handleVolumeMouseDown}
        />
      </div>
    );
  }

  renderVolumeIcon() {
    const {muted, volume} = this.state;

    if (muted) {
      return <i className="icon ion-android-volume-off"/>;
    }

    if (volume === 0) {
      return <i className="icon ion-android-volume-mute"/>;
    } else if (volume === 1) {
      return (
        <div className="player-volume-button-wrap">
          <i className="icon ion-android-volume-up"/>
          <i className="icon ion-android-volume-mute"/>
        </div>
      );
    }

    return (
      <div className="player-volume-button-wrap">
        <i className="icon ion-android-volume-down"/>
        <i className="icon ion-android-volume-mute"/>
      </div>
    );
  }

  onLoad(obj) {
    console.log("load");
    this.setState({
      currentTime:0
    });

    this.setState({
      duration: obj.duration
    });
  }

  onPlaying(obj) {
    if(this.state.isSeeking) return;
    const {dispatch} = this.props;
    this.setState({
      currentTime:obj.position
    });
  }

  onFinishedPlaying(obj) {
    const {dispatch} = this.props;

    dispatch(changeTrack(this.state.shuffle ? CHANGE_TYPES.SHUFFLE : CHANGE_TYPES.NEXT));
  }

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

    const icon = status == Sound.status.PLAYING ? 'pause' : 'play_arrow';

    return (
      <div id="player">
        <div className="imgOverlay">
          <img src={overlay_image}/>
        </div>

        <Sound
          url={appendClientId(track.stream_url)}
          playStatus={status}
          volume={10}
          playFromPosition={this.state.updateTime}

          onLoading={this.onLoad}
          onPlaying={this.onPlaying}
          onFinishedPlaying={this.onFinishedPlaying}/>

        <div className="flex playerInner">
          <div className="playerAlbum">
            <img width={50} height={50} src={image}/>
          </div>
          <div id="playerControls">
            <a href="javascript:void(0)" onClick={prevFunc}><i className="material-icons">skip_previous</i></a>

            <a href="javascript:void(0)" onClick={this.togglePlay}><i className="material-icons">{icon}</i></a>

            <a href="javascript:void(0)" onClick={nextFunc}><i className="material-icons">skip_next</i></a>
          </div>
          <div id="playerTimeLine" className="col-xs-5">
            <div className="time">{getReadableTime(this.state.currentTime)}</div>
            <div className="time">{getReadableTime(this.state.duration)}</div>

            <div className="wrapper">
              <div className="inner" onClick={this.progressClick}>
                <div className="player-progress" ref="seekBar">
                  {
                    this.renderProgress()
                  }
                </div>
              </div>
            </div>

          </div>
          <div id="playerVolume">
            <div ref="volumeBar" className="inner" onClick={this.changeVolume}>
              {
                this.renderVolumeBar()
              }
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
  playingSongId: PropTypes.number,
  playlists: PropTypes.object.isRequired,
  song: PropTypes.object,
  tracks: PropTypes.object.isRequired,
  users: PropTypes.object.isRequired,
};

export default Player;
