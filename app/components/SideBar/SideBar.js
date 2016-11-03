// @flow
import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from '../../assets/css/sidebar.css';

import Navigation from './Navigation';


class SideBar extends Component {
    render() {
        return (
            <Navigation />
        );
    }
}

export default SideBar;
