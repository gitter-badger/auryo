import React, {Component, PropTypes} from "react";
import styles from "./style.css";
import classnames from "classnames";

class Spinner extends React.Component {
  render() {
    const {card} = this.props;

    const c = classnames(
      styles.loadingWrapper,
      {
        "col-xs-12 col-sm-6 col-lg-4 col-xl-s-5 ": card,
        [styles.loading_box]: card
      }
    );
    return (
      <div className={c}>
        <div className={styles.loading_inner}>
          <ul className={styles.loading}>
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
          <ul className={styles.loading}>
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
