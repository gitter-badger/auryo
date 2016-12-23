import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";

import {PLAYER_STATUS} from "../constants";
import {toggleStatus} from "../actions";

class TogglePlay extends Component {
    constructor(props) {
        super(props);
        this.togglePlay = this.togglePlay.bind(this);
    }

    togglePlay(e) {
        e.preventDefault();

        const {status, dispatch} = this.props;

        if (status !== PLAYER_STATUS.PLAYING) {
            dispatch(toggleStatus(PLAYER_STATUS.PLAYING));
        } else if (status == PLAYER_STATUS.PLAYING) {
            dispatch(toggleStatus(PLAYER_STATUS.PAUSED));
        }

    }

    render() {
        const {status, className} = this.props;

        const icon = (status == PLAYER_STATUS.PLAYING) ? 'pause' : 'play_arrow';

        return (

            <a href="javascript:void(0)" className={className} onClick={this.togglePlay}>
                <i className={`icon-${icon}`}/>
            </a>
        );
    }
}

TogglePlay.propTypes = {
    status: PropTypes.string,
    dispatch: PropTypes.func,
    className: PropTypes.string.isRequired
};

function mapStateToProps(state) {
    const {player} = state;
    const {status} = player;

    return {
        status,
    };
}

export default connect(mapStateToProps)(TogglePlay);
