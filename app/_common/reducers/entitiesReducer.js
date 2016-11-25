import merge from "lodash/merge";

const initialState = {
    playlist_entities: {},
    track_entities: {},
    user_entities: {},
    feedInfo_entities: {},
    comment_entities: {}
};

export default function entities(state = initialState, action) {
    if (action.entities) {
        return merge({}, state, action.entities);
    }

    return state;
}
