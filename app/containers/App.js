// @flow
import React, {Component, PropTypes} from 'react';
import Player from '../components/Player';
import Navigation from '../components/Navigation';

export default class App extends Component {
    static propTypes = {
        children: PropTypes.element.isRequired
    };

    render() {
        return (
            <div>
                <Navigation />,
                {this.props.children}
                <Player />
            </div>
        );
    }
}
