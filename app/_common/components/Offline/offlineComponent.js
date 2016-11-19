// @flow
import React, {Component} from "react";
import {connect} from "react-redux";

class offlineContainer extends Component {
  render() {

    return (
      <div className="offline" style={{backgroundImage:'url(assets/img/party2.jpg)'}}>
        <div>
          <h2>You seem to be offline</h2>
          <p>But we got this, you just have to reconnect.</p>
          <div className="blobs">
            <div className="blob"></div>
            <div className="blob"></div>
          </div>

          <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="goo">
                <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10" />
                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
                <feBlend in2="goo" in="SourceGraphic" result="mix" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>

    );
  }
}




export default connect()(offlineContainer);
