// @flow
import React from "react";
import {Route, IndexRoute} from "react-router";
import App from "./containers/App";
import FeedPage from "./containers/feedContainer";
import ChartPage from "./containers/ChartPage";
import LikesPage from "./containers/LikesPage";
import PlaylistPage from "./containers/PlaylistPage";


export default (
  <Route path="/" component={App}>
    <IndexRoute name="feed" component={FeedPage}/>
    <Route name="chart" path="/chart" component={ChartPage}/>
    <Route name="likes" path="/likes" component={LikesPage}/>
    <Route name="playlists" path="/playlists" component={PlaylistPage}/>
  </Route>
);
