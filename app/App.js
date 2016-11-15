// @flow
import React,{Component, PropTypes} from "react";
import PlayerContainer from "./_Player/playerContainer";
import IsOffline from "./_common/components/Offline/offlineComponent";
import SideBar from "./_common/components/Sidebar/sidebarComponent";
import Header from "./_common/components/Header/Header";
import * as actions from "./_common/actions";
import {connect} from "react-redux";

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
      // TODO refetch everything
    }
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(actions.initUser());
  }

  renderMain() {
    const {online} = this.state;

    if (!online) {
      return <IsOffline />;
    }

    return this.props.children;
  }

  render() {
    const {me} = this.props;


    return (
      <div>
        <Header />
        <SideBar me={me}/>
        <main>
          {
            this.renderMain()
          }
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
