// @flow
import React, {Component, PropTypes} from "react";


class PageHeader extends Component {

  render() {
    const {title} = this.props;

    return (
      <h2>{title}</h2>
    );
  }
}

PageHeader.propTypes = {
  title: PropTypes.string.isRequired
};

export default PageHeader;
