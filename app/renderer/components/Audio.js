import React, {PropTypes, Component} from "react";
import ReactDOM from "react-dom";

import {PLAYER_STATUS} from "../constants"

class Audio extends Component {

    constructor(props) {
        super(props);

        this.state = {
            status: PLAYER_STATUS.STOPPED,
        };

        // html audio element used for playback
        this.audio = null;
    }

    componentDidMount() {

        const audio = this.audio = ReactDOM.findDOMNode(this.refs.audio);
        audio.preload = 'auto';
        audio.addEventListener('ended', this.props.onFinishedPlaying);
        audio.addEventListener('timeupdate', () => {
            if (this.audio) {
                this.props.onPlaying(this.audio.currentTime);
            }
        });

        audio.addEventListener('loadedmetadata', () => {
            if (this.audio) {
                this.props.onLoading(this.audio.duration);
            }
        });

        audio.addEventListener('play', () => this.toggleStatus(PLAYER_STATUS.PLAYING));

        audio.addEventListener('stalled', () => this.toggleStatus(PLAYER_STATUS.PAUSED));

        this.toggleStatus(this.props.playStatus);
    }

    componentWillUnmount() {

        /* pause the audio element before dereferencing it
         * (we can't know when garbage collection will run)
         */
        this.audio.pause();
        this.audio = null;
    }

    componentWillReceiveProps(nextProps) {
        const {playStatus, playFromPosition, url, id, volume, offline} = this.props;

        if (playStatus != nextProps.playStatus) {
            this.toggleStatus(nextProps.playStatus);
        }

        if (playFromPosition !== nextProps.playFromPosition) {
            this.audio.currentTime = nextProps.playFromPosition;
        }

        if (url != nextProps.url || id != nextProps.id) {

            this.audio.pause();
            this.audio.currentTime = 0;
            this.audio.src = nextProps.url;
            this.audio.load();
            this.audio.play();
        }

        if (volume != nextProps.volume) {
            this.audio.volume = nextProps.volume / 100;
        }

        if (offline != nextProps.offline) {
            const time = this.audio.currentTime;
            this.audio.load();
            this.audio.currentTime = time;
            if (nextProps.playStatus == PLAYER_STATUS.PLAYING) {
                this.audio.play();
            }
        }


    }

    toggleStatus(value) {
        const {status} = this.state;

        if (!this.audio) {
            return;
        }

        if (status == value) {
            return;
        }

        try {
            if (value == PLAYER_STATUS.PLAYING) {
                if (status !== PLAYER_STATUS.PLAYING) {
                    this.audio.play();
                }
            } else if (value == PLAYER_STATUS.PAUSED) {
                this.audio.pause();
            } else if (value == PLAYER_STATUS.STOPPED) {
                this.audio.pause();
                this.audio.currentTime = 0;
            }
        } catch (error) {
            console.log("error in audio", error)
        }

        this.setState({
            status: value
        });
    }

    render() {
        const {url, muted, onError} = this.props;

        return (
            <audio ref="audio"
                   muted={muted}
                   onError={(e) => onError(e, this.audio)}>
                <source src={url}/>
            </audio>
        );
    }

}

Audio.propTypes = {
    autoplay: PropTypes.bool,
    url: PropTypes.string.isRequired,
    playStatus: PropTypes.string,
    volume: PropTypes.number.isRequired,
    playFromPosition: PropTypes.number.isRequired,
    muted: PropTypes.bool.isRequired,
    id: PropTypes.number.isRequired,

    onLoading: PropTypes.func.isRequired,
    onPlaying: PropTypes.func.isRequired,
    onFinishedPlaying: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
    offline: PropTypes.bool.isRequired
};

export default Audio;
