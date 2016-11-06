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
        const {auth} = this.props;
        return (
            <div>
                <Header />
                <div id="main">
                    <SideBar auth={auth}/>
                    <div className="main clearfix">
                        {this.props.children}
                    </div>

                </div>
                <footer className="container-fluid navbar-fixed-bottom">
                    <PlayerContainer/>
                </footer>
            </div>
        );
    }
}


App.propTypes = {
    dispatch: PropTypes.func.isRequired,
    children: PropTypes.element.isRequired,
    auth: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    const {auth} = state;
    return {
        auth
    }
}

export default connect(mapStateToProps)(App);
