// @flow
import React, {Component, PropTypes} from "react";
import PlayerContainer from "./playerContainer";
import OfflineContainer from "./offlineContainer";
import SideBar from "../components/SideBar/sidebar.component";
import Header from "../components/Header/Header";
import * as actions from "../actions";
import {connect} from "react-redux";
import {ipcRenderer} from "electron";

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
      return <OfflineContainer />;
    }

    return (
      <div className="main-inner">
        {this.props.children}
      </div>
    );
  }

  render() {
    const {me} = this.props;

    return (
      <div>
        <Header />
        <main>
          <SideBar me={me}/>
          <div className="main">
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
  const {user} = state;
  const {me} = user;
  return {
    me
  }
}

export default connect(mapStateToProps)(App);
