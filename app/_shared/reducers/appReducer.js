import * as actionTypes from "../constants/actionTypes";

const initialState = {
    loaded: false,
    offline: false,
    update: {
        available: false,
        version: null
    },
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
            };
        case actionTypes.APP_SET_LOADED:
            return {
                ...state,
                loaded: true
            };
        case actionTypes.APP_SET_UPDATE_AVAILABLE:
            return {
                ...state,
                update: {
                    ...state.update,
                    available: true,
                    version: action.version
                }
            }
    }

    return state;
}
