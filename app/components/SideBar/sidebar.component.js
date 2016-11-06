// @flow
import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import styles from '../../assets/css/sidebar.css';

import Navigation from './Navigation/navigation.component';
import User from './User/user.component';


class SideBar extends Component {
    render() {
        const {user} = this.props;
        return (
            <aside className="sidebar-offcanvas" id="sidebar" role="navigation">
                <User user={user}/>
                <Navigation />
            </aside>
        );
    }
}

SideBar.propTypes = {
    user: PropTypes.object.isRequired
};

export default SideBar;
