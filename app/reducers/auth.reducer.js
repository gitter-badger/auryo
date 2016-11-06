import * as actionTypes from '../constants/actionTypes';

const initialState = {
    user: null,
    following: {},
    likes: {},
    playlists: [],
    newStreamSongs: []

};

export default function auth(state = initialState, action) {

    switch (action.type) {
        case actionTypes.RECEIVE_USER:
            return {
                ...state,
                user: action.user
            };
        case actionTypes.RECEIVE_LIKES:
            return {
                ...state,
                likes: action.likes
            };
        case actionTypes.RECEIVE_FOLLOWINGS:
            return {
                ...state,
                following: action.users
            };
        case actionTypes.RECEIVE_PLAYLISTS:
            return {
                ...state,
                playlists:action.playlists
            }
    }
    return state;
}