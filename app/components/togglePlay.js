import React, { Component, PropTypes } from 'react';

class TogglePlayButton extends Component {
  constructor() {
    super();
    this.togglePlay = this.togglePlay.bind(this);
  }

  togglePlay() {
    const { isPlaying } = this.props;
    const audioElement = document.getElementById('audio');
    if (!audioElement) {
      return;
    }

    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play();
    }
  }

  render() {
    const { isPlaying } = this.props;

    const icon = isPlaying ? 'icon-controller-paus' : 'icon-controller-play';

    return (

      <a className="playButton" onClick={this.togglePlay}>
        <i className={icon}/>
      </a>
    );
  }
}

TogglePlayButton.propTypes = {
  isPlaying: PropTypes.bool.isRequired,
};

export default TogglePlayButton;
