import React, {PropTypes, Component} from "react";
import ReactDOM from "react-dom";

const status = {
  PLAYING: 'PLAYING',
  STOPPED: 'STOPPED',
  PAUSED: 'PAUSED'
};

class Audio extends Component {

  constructor(props) {
    super(props);

    this.state = {
      status: status.STOPPED,
    };

    this.onError = this.onError.bind(this);

    // html audio element used for playback
    this.audio = null;
  }

  componentDidMount() {

    const audio = this.audio = ReactDOM.findDOMNode(this.refs.audio);
    audio.preload = 'metadata';
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

    audio.addEventListener('play', () => this.toggleStatus(status.PLAYING));

    audio.addEventListener('stalled', () => this.toggleStatus(status.PAUSED));

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
    if (this.props.playStatus != nextProps.playStatus) {
      this.toggleStatus(nextProps.playStatus);
    }

    if (this.props.playFromPosition !== nextProps.playFromPosition) {
      this.audio.currentTime = nextProps.playFromPosition;
    }

    if (this.props.url != nextProps.url || this.props.id != nextProps.id) {

      if (this.state.status == status.PLAYING) {
        this.audio.pause();
      }
      this.audio.src = nextProps.url;
      this.audio.play();
    }

    if (this.props.volume != nextProps.volume) {
      this.audio.volume = nextProps.volume / 100;
    }


  }

  componentDidUpdate() {

  }

  toggleStatus(value) {
    if (!this.audio) {
      return;
    }

    if (this.state.status == value) {
      return;
    }

    try {
      if (value == status.PLAYING && (this.state.status !== status.PLAYING)) {
        this.audio.play();
      } else if (value == status.PAUSED) {
        this.audio.pause();
      } else if (value == status.STOPPED) {
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

  onError(e) {
    const {onError} = this.props;

    onError(e, this.audio);
  }

  render() {
    const {url, muted} = this.props;

    return (
      <audio ref="audio" muted={muted}
             onError={this.onError}>
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
  onError: PropTypes.func.isRequired
};

export default Audio;
