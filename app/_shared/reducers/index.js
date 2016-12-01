import {combineReducers} from "redux";
import {routerReducer as routing} from "react-router-redux";
import auth from "./authReducer";
import entities from "./entitiesReducer";
import player from "../../player/reducers/playerReducer";
import objects from "./objectReducer";
import app from "./appReducer";

export default combineReducers({
  auth,
  entities,
  player,
  objects,
  app,
  routing
});
