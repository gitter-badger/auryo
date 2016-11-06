// @flow
import {combineReducers} from 'redux';
import {routerReducer as routing} from 'react-router-redux';
import auth from './auth.reducer';
import playlists from './playlist.reducer';
import entities from './entities.reducer';
import environment from './environment.reducer';

export default combineReducers({
    auth,
    playlists,
    entities,
    environment,
    routing
});