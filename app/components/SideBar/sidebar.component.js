// @flow
import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import styles from '../../assets/css/sidebar.css';

import Navigation from './Navigation/navigation.component';
import User from './User/user.component';


class SideBar extends Component {
    render() {
        const {auth} = this.props;
        const {user} = auth;
        return (
            <aside className="sidebar-offcanvas" id="sidebar" role="navigation">
                <User user={user}/>
                <Navigation />
            </aside>
        );
    }
}

SideBar.propTypes = {
    auth: PropTypes.object.isRequired
};

export default SideBar;
