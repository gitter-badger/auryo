// @flow
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import routes from './routes';
import configureStore from './store/configureStore';
import './app.global.css';
import {remote} from 'electron';
var config = remote.require('./utils/config');
import soundcloud from './utils/soundcloud';

const store = configureStore();
const history = syncHistoryWithStore(hashHistory, store);

config.get('access_token', function(err, token) {

    if (err)
        throw err;

    if (!token)
        throw new Error('Refusing to initialize application, authentication token not found.')

    soundcloud.initialize(token);

    render(
        <Provider store={store}>
            <Router history={history} routes={routes} />
        </Provider>,
        document.getElementById('root')
    )
});
