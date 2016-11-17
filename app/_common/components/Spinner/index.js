import React, {Component, PropTypes} from "react";
import classnames from "classnames";

class Spinner extends React.Component {
  render() {
    const {card} = this.props;

    return (
      <div className="loadingWrapper">
        <div className="loading_inner">
          <ul className="loading">
            <li/>
            <li/>
            <li/>
            <li/>
            <li/>
            <li/>
            <li/>
            <li/>
            <li/>
            <li/>
          </ul>
        </div>
      </div>
    );
  }
}

Spinner.propTypes = {
  card: PropTypes.bool,
};

export default Spinner;
