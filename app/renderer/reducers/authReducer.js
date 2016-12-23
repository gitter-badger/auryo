import {actionTypes} from "../constants";

const initialState = {
    me: {},
    followings: {},
    likes: {},
    playlists: [],
    newFeedItems: []
};

export default function (state = initialState, action) {

    switch (action.type) {
        case actionTypes.AUTH_SET:
            return {
                ...state,
                me: action.user
            };
        case actionTypes.AUTH_SET_LIKES:
            return {
                ...state,
                likes: action.result
            };
        case actionTypes.AUTH_SET_FOLLOWINGS:
            return {
                ...state,
                followings: action.result
            };
        case actionTypes.AUTH_SET_PLAYLISTS:
            return {
                ...state,
                playlists: action.playlists
            };
        case actionTypes.AUTH_SET_LIKE:
            return {
                ...state,
                likes: {
                    ...state.likes,
                    [action.trackID]: action.liked
                }
            };
        case actionTypes.AUTH_SET_FOLLOWING:
            return {
                ...state,
                followings: {
                    ...state.followings,
                    [action.userID]: action.following
                }
            };
        case actionTypes.AUTH_ADD_FOLLOWING:
            return {
                ...state,
                followings: {
                    ...state.followings,
                    [action.userID]: 1
                }
            };
        default:
            return state
    }
}
