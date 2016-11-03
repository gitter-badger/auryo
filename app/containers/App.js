// @flow
import React, {Component, PropTypes} from 'react';
import Player from '../components/Player';
import SideBar from '../components/SideBar/SideBar';
import Header from '../components/Header/Header';

export default class App extends Component {
    static propTypes = {
        children: PropTypes.element.isRequired
    };

    render() {
        return (
            <div>
                <Header />
                <div id="main">
                    <SideBar />
                    <div className="main clearfix">
                        {this.props.children}
                    </div>

                </div>
                <footer className="container-fluid navbar-fixed-bottom">
                    <Player/>
                </footer>
            </div>
        );
    }
}
