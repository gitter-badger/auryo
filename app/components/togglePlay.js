import React, {Component, PropTypes} from "react";
import Sound from "./Sound-React";
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
    const {status,classname} = this.props;

    const icon = (status == Sound.status.PLAYING) ? 'pause' : 'play_arrow';

    return (

      <a className={classname} onClick={this.togglePlay}>
        <i className={`icon-${icon}`} />
      </a>
    );
  }
}

TogglePlayButton.propTypes = {
  status: PropTypes.string,
  dispatch: PropTypes.func,
  classname: PropTypes.string.isRequired
};

function mapStateToProps(state) {
  const {player} = state;
  const {status} = player;

  return {
    status,
  };
}

export default connect(mapStateToProps)(TogglePlayButton);
