import React, {Component, PropTypes} from "react";
import Sound from "../components/common/Sound-React";
import {toggleStatus} from "../actions"
import {connect} from "react-redux";

class TogglePlayButton extends Component {
  constructor() {
    super();
    this.togglePlay = this.togglePlay.bind(this);
  }

  togglePlay() {
    const {status,dispatch} = this.props;

    if(status !== Sound.status.PLAYING){
      dispatch(toggleStatus(Sound.status.PLAYING));
    } else if(status == Sound.status.PLAYING){
      dispatch(toggleStatus(Sound.status.PAUSED));
    }

  }

  render() {
    const {status} = this.props;

    const icon = (status == Sound.status.PLAYING) ? 'pause' : 'play_arrow';

    return (

      <a className="playButton" onClick={this.togglePlay}>
        <i className="material-icons">{icon}</i>
      </a>
    );
  }
}

TogglePlayButton.propTypes = {
  status: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  const {player} = state;
  const {status} = player;

  return {
    status,
  };
}

export default connect(mapStateToProps)(TogglePlayButton);
