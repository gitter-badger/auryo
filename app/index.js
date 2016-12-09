import React from "react";
import {render} from "react-dom";
import {Provider} from "react-redux";
import {syncHistoryWithStore} from "react-router-redux";
import HistoryTracker from "back-forward-history";
import {Router, Route, IndexRoute, hashHistory, createMemoryHistory} from "react-router";
import ReactGA from 'react-ga'
import {GOOGLE_GA} from "./_shared/constants/config";

import configureStore from "./_shared/store/configureStore";

import App from "./App";
import Feed from "./streamPage/feedContainer";
import SongDetails from "./songDetailsPage/songContainer";
import ArtistContainer from "./artistPage/artistContainer"
import {ipcRenderer} from "electron";

import "./assets/css/app.scss";

const store = configureStore();

const history = syncHistoryWithStore(createMemoryHistory(), store);

HistoryTracker.listenTo(history);

let ElectronCookies = require('@exponent/electron-cookies');
ElectronCookies.enable({origin: 'https://example.com'});

ReactGA.initialize(GOOGLE_GA, {
    debug: true
});

ReactGA.set({
    location: 'https://example.com/',
    checkProtocolTask: null
});

history.listen(function (location) {
    ReactGA.pageview(location.pathname)
});

render(
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={App}>
                <IndexRoute name="feed" component={Feed}/>
                <Route path="/song/:songId" component={SongDetails}/>
                <Route path="/artist/:artistId" component={ArtistContainer}/>

            </Route>
        </Router>
    </Provider>,
    document.getElementById('root')
);

/*
 <Route path="/chart" component={}/>
 <Route path="/likes" component={}/>
 <Route path="/playlists" component={}/>*/
