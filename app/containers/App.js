// @flow
import React, {Component, PropTypes} from 'react';
import Player from '../components/Player';
import SideBar from '../components/SideBar/SideBar';
import Header from '../components/Header/Header';
import * as actions from '../actions';
import { connect } from 'react-redux';

class App extends Component {
    componentDidMount(){
        const { dispatch } = this.props;
        dispatch(actions.initAuth());
        dispatch(actions.initEnvironment());
    }


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


App.propTypes = {
    dispatch: PropTypes.func.isRequired,
    children: PropTypes.element.isRequired
};

export default connect()(App);
