// @flow
import React, {Component, PropTypes} from "react";


class PageHeader extends Component {

  render() {
    const {title,img} = this.props;

    return (
      <div className="header">

          {img ? <div className="overlay" style={{backgroundImage:"url(" + img + ")"}}>

          </div>: null }

        <h2>{title}</h2>
      </div>
    );
  }
}

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  img: PropTypes.string
};

export default PageHeader;
