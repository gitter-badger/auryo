import React, {Component, PropTypes} from "react";
import {updateTrackImage} from "../../_common/actions";
import {isOnline} from "../../_common/actions/offlineActions";
import {PLACEHOLDER_IMAGE} from "../../_common/constants/global";
import ReactDOM from "react-dom";
import cn from "classnames";

class FallbackImage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: false,
            original: null,
            valid: true
        }
    }

    componentWillReceiveProps(nextProps) {

        if ((nextProps.offline != this.props.offline ) && nextProps.offline == false) {
            const image = ReactDOM.findDOMNode(this.refs.img);
            if(this.state.valid){
                image.src = this.state.original
            } else {
                image.src = PLACEHOLDER_IMAGE;
            }
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        const image = ReactDOM.findDOMNode(this.refs.img);
        return (nextProps.offline != this.props.offline && (nextState.valid && image.src == PLACEHOLDER_IMAGE) || ((nextProps.track_id != this.props.track_id )&& nextProps.offline == true));

        return (nextProps.offline != this.props.offline ) && nextProps.offline == false || (nextProps.track_id != this.props.track_id && nextProps.offline == true)
    }

    onError(e) {
        const {dispatch, track_id, offline} = this.props;

        if (!offline) {
            this.setState({
                valid: false
            });
            if (dispatch) {
                dispatch(isOnline());

                if (track_id) dispatch(updateTrackImage(track_id));
            }
        } else {

            this.setState({
                original: e.target.src
            });
            e.target.src = PLACEHOLDER_IMAGE;
        }
    }

    onLoad(e) {
        this.setState({
            valid: true,
            original: e.target.src
        });
    }

    render() {
        const {src, className} = this.props;

        return (
            <img ref="img" src={src}
                 className={cn(className, "with-fallback")}
                 onLoad={this.onLoad.bind(this)}
                 onError={this.onError.bind(this)}/>

        )
    }
}

FallbackImage.propTypes = {
    src: PropTypes.string.isRequired,
    className: PropTypes.string,
    dispatch: PropTypes.func,
    track_id: PropTypes.number,
    offline: PropTypes.bool.isRequired,

};

export default FallbackImage;
