// @flow
import React, {Component} from 'react';
import {Link,IndexLink} from 'react-router';
import './navigation.global.css';


class Navigation extends Component {

    render() {
        return (
            <div id="sidebar-menu">
                <h2>Discover</h2>
                <ul className="nav">
                    <li className="navItem">
                        <IndexLink to="/" className="navLink" activeClassName="active"><i className="material-icons">home</i> <span>Feed</span></IndexLink>
                    </li>
                </ul>
            </div>
        );
    }
}

export default Navigation;
