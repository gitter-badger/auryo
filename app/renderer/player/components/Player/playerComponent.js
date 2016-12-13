import React, {PropTypes} from "react";
import ReactDOM from "react-dom";
import {appendClientId, getImageUrl} from "../../../_shared/utils/soundcloudUtils";
import {getReadableTime, getPos, truncate} from "../../../_shared/utils/appUtils";
import {IMAGE_SIZES} from "../../../_shared/constants/Soundcloud";
import {CHANGE_TYPES, STATUS} from "../../../_shared/constants/playlist";
import {toggleStatus, changeTrack, setCurrentTime} from "../../../_shared/actions";
import Audio from "../../../_shared/components/Audio";
import cn from "classnames";
import FallbackImage from "../../../_shared/components/FallbackImageComponent"
import {isOnline} from "../../../_shared/actions/app/offlineActions";

class Player extends React.Component {

    constructor(props) {
        super(props);

        const previousVolumeLevel = .5; // TODO get volume

        this.state = {
            currentTime: 0,
            updateTime: 0,
            duration: 0,
            isSeeking: false,
            isVolumeSeeking: false,
            muted: false,
            repeat: false,
            shuffle: false,
            volume: previousVolumeLevel || 50,
            offline: false
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
        this.onError = this.onError.bind(this);

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
        dispatch(toggleStatus(STATUS.STOPPED));
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

        if (status !== STATUS.PLAYING) {
            dispatch(toggleStatus(STATUS.PLAYING));
        } else if (status == STATUS.PLAYING) {
            dispatch(toggleStatus(STATUS.PAUSED));
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
        const {dispatch} = this.props;

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
            isVolumeSeeking: true,
        });
    }

    handleVolumeMouseMove(e) {
        const volumeBar = ReactDOM.findDOMNode(this.refs.volumeBar);

        const box = volumeBar.getBoundingClientRect();
        const start = box.bottom;

        let percent = (start - e.clientY) / box.height;

        percent = percent > 1 ? 1 : percent < 0 ? 0 : percent;
        this.setState({
            volume: percent,
        });
    }

    handleVolumeMouseUp() {
        if (!this.state.isVolumeSeeking) {
            return;
        }

        document.removeEventListener('mousemove', this.handleVolumeMouseMove);
        document.removeEventListener('mouseup', this.handleVolumeMouseUp);

        this.setState({
            isVolumeSeeking: false,
        });
        // Todo write to config
    }

    volumeClick(e) {
        this.setState({
            muted: false
        });


        const box = e.currentTarget.getBoundingClientRect();
        const start = box.bottom;

        let percent = (start - e.clientY) / box.height;

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
        const height = muted ? 0 : volume * 100;
        return (
            <div
                className="currentTime"
                style={{height: `${height}%`}}>
                <div
                    className="handle"
                    onClick={this.handleMouseClick}
                    onMouseDown={this.handleVolumeMouseDown}
                />
            </div>
        );
    }

    // PLAYER LISTENERS

    onLoad(duration) {
        this.setState({
            currentTime: 0,
            updateTime: 0,
            duration: duration
        });
    }

    onPlaying(position) {
        if (this.state.isSeeking) return;
        const {dispatch} = this.props;
        this.setState({
            currentTime: position
        });

        dispatch(setCurrentTime(position));
    }

    onFinishedPlaying() {
        const {dispatch} = this.props;

        dispatch(changeTrack(this.state.shuffle ? CHANGE_TYPES.SHUFFLE : CHANGE_TYPES.NEXT));
    }

    onError(e, audio) {
        const {dispatch, app} = this.props;

        if (!app.offline) {
            dispatch(isOnline());
        }

    }

    // ====

    render() {
        const {player, user_entities, playingSongId, track_entities, dispatch, app} = this.props;
        const {status} = player;

        const track = track_entities[playingSongId];

        track.user = user_entities[track.user_id];

        const prevFunc = this.changeSong.bind(this, CHANGE_TYPES.PREV);
        const nextFunc = this.changeSong.bind(
            this,
            this.state.shuffle ? CHANGE_TYPES.SHUFFLE : CHANGE_TYPES.NEXT
        );

        let overlay_image = getImageUrl(track, IMAGE_SIZES.XLARGE);

        const toggle_play_icon = status == STATUS.PLAYING ? 'pause' : 'play_arrow';
        const volume_icon = this.state.muted || this.state.volume == 0 ? "volume_off" : (this.state.volume == 1) ? "volume_up" : "volume_down";

        return (
            <div className="player">
                <div className="imgOverlay">
                    <FallbackImage
                        offline={app.offline}
                        track_id={track.id}
                        dispatch={dispatch}
                        src={overlay_image}/>
                </div>

                <Audio
                    url={appendClientId(track.stream_url)}
                    playStatus={status}
                    volume={this.state.volume * 100}
                    playFromPosition={this.state.updateTime}
                    muted={this.state.muted}
                    id={playingSongId}

                    offline={app.offline}

                    onLoading={this.onLoad}
                    onPlaying={this.onPlaying}
                    onFinishedPlaying={this.onFinishedPlaying}
                    onError={this.onError}/>

                <div className="flex playerInner">
                    <div className="flex">
                        <div className="playerAlbum">
                            <FallbackImage
                                offline={app.offline}
                                track_id={track.id}
                                dispatch={dispatch}
                                src={overlay_image}/>
                        </div>
                        <div className="trackInfo">
                            <div className="trackTitle"
                                 title={track.title}>{truncate(track.title, 40, "...", true)}</div>
                            <div className="trackArtist">{truncate(track.user.username, 50)}</div>
                        </div>

                        <div className="flex flex-xs-middle playerControls">
                            <a href="javascript:void(0)" onClick={prevFunc}><i className="icon-skip_previous"/></a>

                            <a href="javascript:void(0)" onClick={this.togglePlay}><i
                                className={`icon-${toggle_play_icon}`}/></a>

                            <a href="javascript:void(0)" onClick={nextFunc}><i className="icon-skip_next"/></a>
                        </div>
                    </div>

                    <div className="flex" style={{flexGrow: 1}}>
                        <div className="playerTimeLine">

                            <div className="row progressWrapper">

                                <div className="time">{getReadableTime(this.state.currentTime)}</div>

                                <div className="progressInner"
                                     onClick={this.progressClick}
                                     onMouseDown={this.handleSeekMouseDown}>
                                    <div className="playerProgress" ref="seekBar">
                                        {
                                            this.renderProgressBar()
                                        }
                                    </div>
                                </div>
                                <div className="time">{getReadableTime(this.state.duration)}</div>
                            </div>

                        </div>
                        <div className={cn("flex playerVolume", {hover: this.state.isVolumeSeeking})}>
                            <i className={`icon-${volume_icon}`} onClick={this.toggleMute}/>
                            <div className="progressWrapper">
                                <div className="progressInner" onClick={this.volumeClick}
                                     onMouseDown={this.handleVolumeMouseDown}>
                                    <div className="playerProgress" ref="volumeBar">
                                        {
                                            this.renderVolumeBar()
                                        }
                                    </div>
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
    playingSongId: PropTypes.number,
    playlists: PropTypes.object.isRequired,
    song: PropTypes.object,
    track_entities: PropTypes.object.isRequired,
    user_entities: PropTypes.object.isRequired,
    app: PropTypes.object.isRequired
};

export default Player;
