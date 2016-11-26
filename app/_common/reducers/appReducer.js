import * as actionTypes from "../constants/actionTypes";

const initialState = {
    offline: false,
    last_checked: 0,
    queued_functions: {},
    queued_items: []
};

export default function entities(state = initialState, action) {
    switch (action.type) {
        case actionTypes.APP_TOGGLE_OFFLINE:
            return {
                ...state,
                offline: action.offline,
                last_checked: action.time
            };
        case actionTypes.APP_PUSH_OFFLINE_QUEUE:
            return {
                ...state,
                queued_functions: {
                    ...state.queued_functions,
                    [action.key]: action.func
                },
                queued_items: [
                    ...state.queued_items,
                    action.key
                ]
            };
        case actionTypes.APP_POP_OFFLINE_QUEUE:
            return {
                ...state,
                queued_items: state.queued_items.filter((key) => action.key != key)
            };
        case actionTypes.APP_CLEAR_OFFLINE_QUEUE:
            return {
                ...state,
                offline: false,
                queued_functions: {}
            }
    }

    return state;
}
