// @flow
import {combineReducers} from "redux";
import {routerReducer as routing} from "react-router-redux";
import user from "./userReducer";
import playlists from "./playlistReducer";
import entities from "./entitiesReducer";
import player from "../../_Player/reducers/playerReducer";

export default combineReducers({
  user,
  playlists,
  entities,
  player,
  routing
});
