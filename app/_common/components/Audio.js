import React, {PropTypes} from "react";
import ReactDOM from "react-dom";

/* converts given number of seconds to standard time display format
 * http://goo.gl/kEvnKn
 */
function convertToTime(number) {
  const mins = Math.floor(number / 60);
  const secs = (number % 60).toFixed();
  return `${ mins < 10 ? '0' : '' }${ mins }:${ secs < 10 ? '0' : '' }${ secs }`;
}

const status = {
  PLAYING: 'PLAYING',
  STOPPED: 'STOPPED',
  PAUSED: 'PAUSED'
};

class Audio extends React.Component {

  constructor(props) {
    super(props);

    this.defaultState = {
      /* activeTrackIndex will change to match
       * this.currentTrackIndex once metadata has loaded
       */
      activeTrackIndex: -1,
      // indicates whether audio player should be paused
      paused: true,
      /* elapsed time for current track, in seconds -
       * DISPLAY ONLY! the actual elapsed time may
       * not match up if we're currently seeking, since
       * the new time is visually previewed before the
       * audio seeks.
       */
      displayedTime: 0,

      status: status.STOPPED,
    };

    this.state = this.defaultState;

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
      if(this.audio){
        this.props.onLoading(this.audio.duration);
      }
    });

    audio.addEventListener('play', () => {
      this.setState({
        status: status.PLAYING
      });
    });

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
    if(this.props.playStatus != nextProps.playStatus){
      this.toggleStatus(nextProps.playStatus);
    }

    if (this.props.playFromPosition !== nextProps.playFromPosition) {
      this.audio.currentTime = nextProps.playFromPosition;
    }

    if(this.props.url != nextProps.url || this.props.id != nextProps.id){
      this.audio.pause();
      this.audio.src = nextProps.url;
      this.audio.play();
    }

    if(this.props.volume != nextProps.volume){
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

    if (value == status.PLAYING) {
      try {
        this.audio.play();
      } catch (error) {
        throw error;
      }
    } else if (value == status.PAUSED) {
      this.audio.pause();
    } else if(value == status.STOPPED){
      this.audio.pause();
      this.audio.currentTime = 0;
    }

    this.setState({
      status: value
    });
  }

  render() {
    const {url,muted} = this.props;

    return (
      <audio ref="audio" muted={muted}>
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
  id: PropTypes.string.isRequired,

  onLoading: PropTypes.func.isRequired,
  onPlaying: PropTypes.func.isRequired,
  onFinishedPlaying: PropTypes.func.isRequired,
};

export default Audio;
