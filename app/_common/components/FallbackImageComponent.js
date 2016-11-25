import React, {Component, PropTypes} from "react";
import {updateTrackImage} from "../../_common/actions"

class FallbackImage extends Component {

    onError(e){
        const {dispatch, track_id} = this.props;
        dispatch(updateTrackImage(track_id));
    }

    render() {
        const {src,className} = this.props;

        return (
          <img src={src} className={className} onError={this.onError.bind(this)} />

        )
    }
}

FallbackImage.propTypes = {
    src: PropTypes.string.isRequired,
    className: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    track_id: PropTypes.number.isRequired,

};

export default FallbackImage;
