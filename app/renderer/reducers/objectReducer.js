import {actionTypes, OBJECT_TYPES, PLAYLISTS} from "../constants";

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
                isFetching: action.fetching,
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
        case actionTypes.AUTH_SET_LIKE:
            if (action.liked) {
                return {
                    ...state,
                    items: [action.trackID, ...state.items],
                };
            }
            return {
                ...state,
                items: state.items.filter((key) => action.trackID != key)
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
        case actionTypes.AUTH_SET_LIKE:
            return {
                ...state,
                [PLAYLISTS.LIKES]: objects(state[PLAYLISTS.LIKES], action),
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
        case actionTypes.AUTH_SET_LIKE:
            return {
                ...state,
                [OBJECT_TYPES.PLAYLISTS]: objectgroup(state[OBJECT_TYPES.PLAYLISTS], action),
            };
        default:
            return state
    }
}
