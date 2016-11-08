if (process.env.NODE_ENV === 'production') {
  module.exports = require('./configureStore.production'); // eslint-disable-line global-require
} else {
  module.exports = require('./configureStore.development'); // eslint-disable-line global-require
}

/*
 import {createStore, applyMiddleware} from 'redux';
 import createLogger from 'redux-logger';
 import { browserHistory } from 'react-router';
 import { routerMiddleware } from 'react-router-redux';
 import rootReducer from '../reducers/index';
 import thunk from 'redux-thunk';


 const logger = createLogger();
 const router = routerMiddleware(browserHistory);

 const createStoreWithMiddleware = applyMiddleware(thunk, router, logger)(createStore);

 export default function configureStore(initialState) {
 return createStoreWithMiddleware(rootReducer, initialState);
 }*/
