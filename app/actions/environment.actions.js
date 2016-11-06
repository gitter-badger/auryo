import * as actionTypes from '../constants/actionTypes';

export function changeWidthAndHeight(height, width) {
    return {
        type: actionTypes.CHANGE_WIDTH_AND_HEIGHT,
        height,
        width,
    };
}

export function initEnvironment() {
    return dispatch => {

        dispatch(changeWidthAndHeight(window.innerHeight, window.innerWidth));

        window.onresize = () => {
            dispatch(changeWidthAndHeight(window.innerHeight, window.innerWidth));
        };
    };
}