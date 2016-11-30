import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";

import PlayerContainer from "./_Player/playerContainer";
import IsOffline from "./_common/components/offlineComponent";
import SideBar from "./_common/components/main/Sidebar/sidebarComponent";
import Header from "./_common/components/main/headerComponent";
import Spinner from "./_common/components/spinnerComponent"

import {toggleOffline, initUser} from "./_common/actions";

class App extends Component {
    constructor(props) {
        super(props);

        this.renderMain = this.renderMain.bind(this);
        this.setOnlineStatus = this.setOnlineStatus.bind(this);

        window.addEventListener('online', this.setOnlineStatus);
        window.addEventListener('offline', this.setOnlineStatus);

    }

    setOnlineStatus() {
        const {dispatch} = this.props;

        dispatch(toggleOffline(!navigator.onLine));
    }

    componentDidMount() {
        const {dispatch} = this.props;
        dispatch(initUser());
    }

    renderMain() {
        const {app} = this.props;

        if (app.offline) {
            return <IsOffline />;
        }

        return this.props.children;
    }

    render() {
        const {me,app} = this.props;

        return (
            <div>
                {
                    !app.loaded?  <Spinner full={true} /> : null
                }
                <Header />
                <main>
                <SideBar me={me}/>
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
    const {user, app} = state;
    const {me} = user;
    return {
        me,
        app
    }
}

export default connect(mapStateToProps)(App);
