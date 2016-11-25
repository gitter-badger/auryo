// @flow
import {combineReducers} from "redux";
import {routerReducer as routing} from "react-router-redux";
import user from "./userReducer";
import entities from "./entitiesReducer";
import player from "../../_Player/reducers/playerReducer";
import objects from "./objectReducer";

export default combineReducers({
    user,
    entities,
    player,
    objects,
    routing
});
