// @flow
import React, {Component, PropTypes} from 'react';
import PlayerContainer from './player.container';
import SideBar from '../components/SideBar/sidebar.component';
import Header from '../components/Header/Header';
import * as actions from '../actions';
import {connect} from 'react-redux';

class App extends Component {
    componentDidMount() {
        const {dispatch} = this.props;
        dispatch(actions.initAuth());
        dispatch(actions.initEnvironment());
    }


    render() {
        const {user} = this.props;
        return (
            <div>
                <Header />
                <div id="main">
                    <SideBar user={user}/>
                    <div className="main clearfix">
                        {this.props.children}
                    </div>

                </div>
                <footer className="navbar-fixed-bottom">
                    <PlayerContainer/>
                </footer>
            </div>
        );
    }
}


App.propTypes = {
    dispatch: PropTypes.func.isRequired,
    children: PropTypes.element.isRequired
};

function mapStateToProps(state) {
    const {auth} = state;
    const {user} = auth;
    return {
        user
    }
}

export default connect(mapStateToProps)(App);
