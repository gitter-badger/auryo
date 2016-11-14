// @flow
import React from "react";
import {Route, IndexRoute} from "react-router";
import App from "./containers/App";
import FeedPage from "./containers/feedContainer";
import ChartPage from "./containers/chartContainer";
import LikesPage from "./containers/likesContainer";
import PlaylistPage from "./containers/playlistContainer";
import SongPage from "./containers/songContainer";


export default (
  <Route path="/" component={App}>
    <IndexRoute name="feed" component={FeedPage}/>
    <Route path="/chart" component={ChartPage}/>
    <Route path="/likes" component={LikesPage}/>
    <Route path="/playlists" component={PlaylistPage}/>
  </Route>
);
