import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";


class songComponent extends Component {

  render() {
    const {tracks} = this.props;

    console.log(tracks);

    return (
      <div className="">
        <h2>Song</h2>
      </div>
    );
  }
}

songComponent.propTypes = {
  track: PropTypes.object.isRequired
};


export default songComponent;
