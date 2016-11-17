// @flow
import React, {Component, PropTypes} from "react";
import Navigation from "./Navigation/navigationComponent";
import User from "./User/userComponent";

class SideBar extends Component {
  render() {
    const {me} = this.props;
    return (
      <aside className="sidebar-offcanvas" id="sidebar" role="navigation">
        <User me={me}/>
        <Navigation />
      </aside>
    );
  }
}

SideBar.propTypes = {
  me: PropTypes.object.isRequired
};

export default SideBar;
