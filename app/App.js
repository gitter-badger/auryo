import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";

import PlayerContainer from "./player/playerContainer";
import IsOffline from "./_shared/components/offlineComponent";
import SideBar from "./_shared/components/main/Sidebar/sidebarComponent";
import Header from "./_shared/components/main/headerComponent";
import Spinner from "./_shared/components/spinnerComponent"

import {toggleOffline, initUser} from "./_shared/actions";

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

        if (!app.loaded && app.offline) {
            return <IsOffline full={true} />;
        }

        return this.props.children;
    }

    render() {
        const {me,app} = this.props;

        return (
            <div>
                {
                    !app.loaded && !app.offline?  <Spinner full={true} /> : null
                }
                <Header />
                <main>
                <SideBar me={me}/>
                    <section className="content">
                        {
                            app.loaded && app.offline?  <IsOffline full={false} /> : null
                        }
                        {
                            this.renderMain()
                        }
                    </section>
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
    const {auth, app} = state;
    const {me} = auth;
    return {
        me,
        app
    }
}

export default connect(mapStateToProps)(App);
