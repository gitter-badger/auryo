// @flow
import React, {Component} from "react";
import {Link, IndexLink} from "react-router";
import "./navigation.global.css";


class Navigation extends Component {

  render() {
    return (
      <div id="sidebar-menu">
        <h2>Discover</h2>
        <ul className="nav">
          <li className="navItem">
            <IndexLink to="/" className="navLink" activeClassName="active">
              <i className="icon-home" />
              <span>Feed</span>
            </IndexLink>
          </li>
          <li className="navItem">
            <Link to="/chart" className="navLink" activeClassName="active">
              <i className="icon-poll" />
              <span>Charts</span></Link>
          </li>
        </ul>
        <h2>Me</h2>
        <ul className="nav">
          <li className="navItem">
            <Link to="/likes" className="navLink" activeClassName="active">
              <i className="icon-favorite" />
              <span>Likes</span></Link>
          </li>
          <li className="navItem">
            <Link to="/playlists" className="navLink" activeClassName="active">
              <i className="icon-album" />
              <span>Playlists</span></Link>
          </li>
        </ul>
      </div>
    );
  }
}

export default Navigation;
