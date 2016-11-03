// @flow
import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import StreamPage from './containers/StreamPage';
import ChartPage from './containers/ChartPage';
import LikesPage from './containers/LikesPage';
import PlaylistPage from './containers/PlaylistPage';


export default (
  <Route path="/" component={App}>
    <IndexRoute component={StreamPage} />
    <Route path="/chart" component={ChartPage} />
    <Route path="/likes" component={LikesPage} />
    <Route path="/playlists" component={PlaylistPage} />
  </Route>
);
