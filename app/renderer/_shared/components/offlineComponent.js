import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import { Alert } from 'reactstrap';

import Spinner from "./spinnerComponent"

import "../../assets/css/common/offline.scss"

class offlineContainer extends Component {
    render() {
        const {full} = this.props;

        if (!full) {
            return (
                <div className="offline">
                    <Alert color="info" className="m-a-0">
                        <i className="icon-error_outline"></i> You are currently offline, please reconnect!
                    </Alert>

                </div>
            )
        }
        return (
            <div className="offline full">
                <div className="img-overlay" style={{backgroundImage: 'url(assets/img/party2-t.png)'}}></div>
                <div className="offline-content">
                    <h2>You seem to be offline</h2>
                    <p>But we got this, you just have to reconnect.</p>
                    <Spinner />
                </div>
            </div>

        );
    }
}

offlineContainer.propTypes = {
    full: PropTypes.bool
};

export default connect()(offlineContainer);
