// @flow
import React, {Component} from 'react';
import {Link} from 'react-router';


class Navigation extends Component {
    render() {
        return (
            <aside className="sidebar-offcanvas" id="sidebar" role="navigation">
                <ul className="nav nav-pills nav-stacked">
                    <li className="nav-item">
                        <Link className="nav-link" to="/">Feed</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="chart">Chart</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="likes">Likes</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="playlists">Playlists</Link>
                    </li>
                </ul>
            </aside>
        );
    }
}

export default Navigation;
