import merge from "lodash/merge";

const initialState = {
    playlists: {},
    tracks: {},
    users: {},
    feedInfo: {}
};

export default function entities(state = initialState, action) {
    if (action.entities) {
        return merge({}, state, action.entities);
    }

    return state;
}
