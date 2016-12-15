import React from "react";
import {render} from "react-dom";
import {Provider} from "react-redux";
import {syncHistoryWithStore} from "react-router-redux";
import HistoryTracker from "back-forward-history";
import {Router, Route, IndexRoute, hashHistory, createMemoryHistory} from "react-router";
import ReactGA from 'react-ga'
import {GOOGLE_GA} from "../config";

import configureStore from "./store/configureStore"

import App from "./App"
import Feed from "./container/feedContainer"
import Song from "./container/songContainer"
import Artist from "./container/artistContainer"
import Likes from "./container/likesContainer"

import "./assets/css/app.scss";

const store = configureStore();

const history = syncHistoryWithStore(createMemoryHistory(), store);

HistoryTracker.listenTo(history);

ReactGA.initialize(GOOGLE_GA);

if (process.env.NODE_ENV === 'production') {
    ReactGA.initialize(GOOGLE_GA);

    history.listen(function (location) {
        ReactGA.pageview(location.pathname)
    });
}

render(
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={App}>
                <IndexRoute name="feed" component={Feed}/>
                <Route path="/song/:songId" component={Song}/>
                <Route path="/artist/:artistId" component={Artist}/>
                <Route path="/likes" component={Likes}/>
                {/*
                 <Route path="/chart" component={}/>
                 <Route path="/likes" component={}/>
                 <Route path="/playlists" component={}/>*/}
            </Route>
        </Router>
    </Provider>,
    document.getElementById('root')
);

