// @flow
import React, {Component, PropTypes} from "react";
import PlayerContainer from "./playerContainer";
import isOffline from "../components/offlineComponent";
import SideBar from "../components/SideBar/sidebar.component";
import Header from "../components/Header/Header";
import * as actions from "../actions";
import {connect} from "react-redux";
import {ipcRenderer} from "electron";
import {STATUS} from "../constants/playlist"
import cn from "classnames";

class App extends Component {
  constructor(props) {
    super(props);

    this.renderMain = this.renderMain.bind(this);
    this.setOnlineStatus = this.setOnlineStatus.bind(this);

    this.state = {
      online: navigator.onLine
    };

    window.addEventListener('online', this.setOnlineStatus);
    window.addEventListener('offline', this.setOnlineStatus);

  }

  setOnlineStatus() {
    const {dispatch} = this.props;

    this.setState({
      online: navigator.onLine
    });

    if (navigator.onLine == true) {
      dispatch(actions.initUser());
      this.forceUpdate();
    }
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(actions.initUser());
  }

  renderMain() {
    const {online} = this.state;

    if (!online) {
      return <isOffline />;
    }

    return this.props.children;
  }

  render() {
    const {me,isPlaying} = this.props;


    return (
      <div>
        <Header />
        <main>
          <SideBar me={me}/>
          <div>
            {
              this.renderMain()
            }
          </div>

        </main>
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
  const {user,player} = state;
  const {me} = user;
  return {
    me,
    isPlaying: player.currentSong != null
  }
}

export default connect(mapStateToProps)(App);
