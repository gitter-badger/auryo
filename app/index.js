import React from "react";
import {render} from "react-dom";
import {Provider} from "react-redux";
import {Router, Route, IndexRoute,hashHistory, createMemoryHistory} from "react-router";
import {syncHistoryWithStore} from "react-router-redux";
import configureStore from "./_common/store/configureStore";
import "./assets/css/app.scss";
import App from "./App";
import Feed from "./_Feed/feedContainer";
import SongDetails from "./_SongDetails/songContainer";
import HistoryTracker from "back-forward-history";
import fetchIntercept from 'fetch-intercept';

const unregister = fetchIntercept.register({
  request: function (url, config) {
    // Modify the url or config here
    return [url, config];
  },

  requestError: function (error) {
    // Called when an error occured during another 'request' interceptor call
    console.log("requesterror");
    return Promise.reject(error);
  },

  response: function (response) {
    // Modify the reponse object
    return response;
  },

  responseError: function (error) {
    // Handle an fetch error
    console.log("eeorororororo");
    return Promise.reject(error);
  }
});

const store = configureStore();

const history = syncHistoryWithStore(createMemoryHistory(), store);

HistoryTracker.listenTo(history);

render(
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={App}>
                <IndexRoute name="feed" component={Feed}/>
                <Route path="/song/:songId" component={SongDetails}/>

            </Route>
        </Router>
    </Provider>,
    document.getElementById('root')
);

/*
 <Route path="/chart" component={}/>
 <Route path="/likes" component={}/>
 <Route path="/playlists" component={}/>*/
