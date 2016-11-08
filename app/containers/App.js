// @flow
import React, {Component, PropTypes} from "react";
import PlayerContainer from "./playerContainer";
import SideBar from "../components/SideBar/sidebar.component";
import Header from "../components/Header/Header";
import * as actions from "../actions";
import {connect} from "react-redux";
import {ipcRenderer} from 'electron';

class App extends Component {
  componentDidMount(){
    const {dispatch} = this.props;
    dispatch(actions.initUser());
  }

  render() {
    const {me} = this.props;

    return (
      <div>
        <Header />
        <div id="main">
          <SideBar me={me}/>
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
  const {user} = state;
  const {me} = user;
  return {
    me
  }
}

export default connect(mapStateToProps)(App);
