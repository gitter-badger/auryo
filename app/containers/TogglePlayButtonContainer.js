
import React, { Component } from 'react';
import { connect } from 'react-redux';
import TogglePlayButton from '../components/togglePlay';

class TogglePlayButtonContainer extends Component {
  render() {
    return <TogglePlayButton {...this.props} />;
  }
}

function mapStateToProps(state) {
  const { player } = state;
  const { isPlaying } = player;

  return {
    isPlaying,
  };
}

export default connect(mapStateToProps)(TogglePlayButtonContainer);
