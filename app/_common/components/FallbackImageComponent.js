import React, {Component, PropTypes} from "react";
import {updateTrackImage} from "../../_common/actions";
import {isOnline} from "../../_common/actions/";
import {PLACEHOLDER_IMAGE} from "../../_common/constants/global";
import ReactDOM from "react-dom";
import cn from "classnames";

class FallbackImage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            original: null,
            valid: true,
            has_checked: false,
            recheck: false
        }
    }

    componentWillReceiveProps(nextProps) {

        const image = ReactDOM.findDOMNode(this.refs.img);

        if (nextProps.offline != this.props.offline && nextProps.offline == false) {
            if(this.state.valid && image.src == PLACEHOLDER_IMAGE || this.state.recheck){
                image.src = this.state.original
            } else if(!this.state.valid && !this.state.recheck){
                image.src = PLACEHOLDER_IMAGE;
            }
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        const image = ReactDOM.findDOMNode(this.refs.img);

        // If next props changes to online
        if ((nextProps.offline != this.props.offline && nextProps.offline == false)) {
            if ((nextState.valid && image.src == PLACEHOLDER_IMAGE) || nextState.recheck) {
                return true
            }

        } else if (nextProps.track_id != this.props.track_id) {
            return true
        }
        return false
    }

    onError(e) {
        const {dispatch, track_id, offline} = this.props;

        if (!offline) {
            if (dispatch) {
                let func;
                if (track_id) {
                    func = updateTrackImage.bind(this, track_id);
                }
                dispatch(isOnline(func));
            }

            this.setState({
                valid: false,
                recheck: false,
                has_checked: true
            });
        } else {

            this.setState({
                original: e.target.src,
                recheck: true,
                has_checked: true
            });
        }
        e.target.src = PLACEHOLDER_IMAGE;
    }

    onLoad(e) {
        const image = ReactDOM.findDOMNode(this.refs.img);


        if(this.state.has_checked && !this.state.valid && image.src.indexOf(PLACEHOLDER_IMAGE) == -1){
            this.setState({
                valid: true,
                recheck: false,
                original: e.target.src,
                has_checked: true
            });
        }
    }

    render() {
        const {src, className,offline} = this.props;

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
