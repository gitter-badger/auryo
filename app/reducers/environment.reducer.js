import * as actionTypes from '../constants/actionTypes';

const initialState = {
    height: null,
    width: null,
};

export default function environment(state = initialState, action) {
    switch (action.type) {
        case actionTypes.CHANGE_WIDTH_AND_HEIGHT:
            return {
                ...state,
                height: action.height,
                width: action.width,
            };
    }

    return state;
}