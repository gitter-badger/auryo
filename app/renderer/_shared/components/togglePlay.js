import React, {Component, PropTypes} from "react";
import {STATUS} from "../constants/playlist";
import {toggleStatus} from "../actions";
import {connect} from "react-redux";

class TogglePlayButton extends Component {
    constructor() {
        super();
        this.togglePlay = this.togglePlay.bind(this);
    }

    togglePlay(e) {
        e.preventDefault();
        e.stopPropagation();

        const {status, dispatch} = this.props;

        if (status !== STATUS.PLAYING) {
            dispatch(toggleStatus(STATUS.PLAYING));
        } else if (status == STATUS.PLAYING) {
            dispatch(toggleStatus(STATUS.PAUSED));
        }

    }

    render() {
        const {status, classname} = this.props;

        const icon = (status == STATUS.PLAYING) ? 'pause' : 'play_arrow';

        return (

            <a href="javascript:void(0)" className={classname} onClick={this.togglePlay}>
                <i className={`icon-${icon}`}/>
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
