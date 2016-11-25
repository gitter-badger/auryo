import * as actionTypes from "../constants/actionTypes";
import {OBJECT_TYPES} from "../constants/global";

const initialObjectsState = {
    isFetching: false,
    items: [],
    futureUrl: false,
    nextUrl: false,

};

function objects(state = initialObjectsState, action) {

    switch (action.type) {
        case actionTypes.OBJECT_IS_FETCHING:
            return {
                ...state,
                isFetching: true,
                nextUrl: null
            };
        case actionTypes.OBJECT_SET:
            return {
                ...state,
                isFetching: false,
                items: [...state.items, ...action.result],
                futureUrl: action.futureUrl,
                nextUrl: action.nextUrl
            };
        case actionTypes.OBJECT_SET_NEW_ITEMS:
            return {
                ...state,
                futureUrl: action.futureUrl
            };
    }
    return state;
}

const initialObjectGroupState = {};

function objectgroup(state = initialObjectGroupState, action) {
    switch (action.type) {
        case actionTypes.OBJECT_IS_FETCHING:
        case actionTypes.OBJECT_SET:
        case actionTypes.OBJECT_SET_NEW_ITEMS:
            return {
                ...state,
                [action.object_id]: objects(state[action.object_id], action),
            };

    }
    return state;
}


const initialState = {
    [OBJECT_TYPES.PLAYLISTS]: {},
    [OBJECT_TYPES.COMMENTS]: {}
};

export default function objectsgroups(state = initialState, action) {
    switch (action.type) {
        case actionTypes.OBJECT_IS_FETCHING:
        case actionTypes.OBJECT_SET:
        case actionTypes.OBJECT_SET_NEW_ITEMS:
            return {
                ...state,
                [action.object_type]: objectgroup(state[action.object_type], action),
            };

    }
    return state;
}
