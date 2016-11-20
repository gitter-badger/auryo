import * as actionTypes from "../constants/actionTypes";

const initialState = {
  me: {},
  followings: {},
  likes: {},
  playlists: [],
  newFeedItems: []
};

export default function (state = initialState, action) {

  switch (action.type) {
    case actionTypes.USER_SET:
      return {
        ...state,
        me: action.user
      };
    case actionTypes.USER_SET_LIKES:
      return {
        ...state,
        likes: action.result
      };
    case actionTypes.USER_SET_FOLLOWINGS:
      return {
        ...state,
        followings: action.result
      };
    case actionTypes.USER_SET_PLAYLISTS:
      return {
        ...state,
        playlists: action.playlists
      };
    case actionTypes.USER_SET_LIKE:
      return {
        ...state,
        likes: {
          ...state.likes,
          [action.trackID]: action.liked
        }
      };
    case actionTypes.USER_ADD_LIKE:
      return {
        ...state,
        likes: {
          ...state.likes,
          [action.trackID]: 1
        }
      };
    case actionTypes.USER_SET_FOLLOWING:
      return {
        ...state,
        followings: {
          ...state.followings,
          [action.userID]: action.following
        }
      };
    case actionTypes.USER_ADD_FOLLOWING:
      return {
        ...state,
        followings: {
          ...state.followings,
          [action.userID]: 1
        }
      }
  }
  return state;
}
