import React, {Component, PropTypes} from "react";
import {updateTrackImage} from "../../_common/actions"
import {PLACEHOLDER_IMAGE} from "../../_common/constants/global"

class FallbackImage extends Component {

  onError(e) {
    const {dispatch, track_id} = this.props;
    if (dispatch && track_id) {
      dispatch(updateTrackImage(track_id));
    } else {
      e.target.src = PLACEHOLDER_IMAGE;
    }
  }

  render() {
    const {src, className} = this.props;

    return (
      <img src={src} className={className} onError={this.onError.bind(this)}/>

    )
  }
}

FallbackImage.propTypes = {
  src: PropTypes.string.isRequired,
  className: PropTypes.string,
  dispatch: PropTypes.func,
  track_id: PropTypes.number,

};

export default FallbackImage;
