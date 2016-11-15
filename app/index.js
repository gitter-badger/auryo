// @flow
import React from "react";
import {render} from "react-dom";
import {Provider} from "react-redux";
import {Router, hashHistory, Route, IndexRoute} from "react-router";
import {syncHistoryWithStore} from "react-router-redux";
import configureStore from "./common/store/configureStore";
import "./assets/css/app.global.css";
import App from "./App";
import Feed from "./Feed/feedContainer";
import SongDetails from "./SongDetails/songContainer";


const store = configureStore();

const history = syncHistoryWithStore(hashHistory, store);

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
