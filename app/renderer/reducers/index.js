import {combineReducers} from "redux";
import {routerReducer as routing} from "react-router-redux";
import auth from "./authReducer";
import entities from "./entitiesReducer";
import player from "./playerReducer";
import objects from "./objectReducer";
import app from "./appReducer";
import {reducer as notifications} from 'react-notification-system-redux';

export default combineReducers({
  auth,
  entities,
  player,
  objects,
  app,
  notifications,
  routing
});
