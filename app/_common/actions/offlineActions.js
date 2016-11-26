import * as actionTypes from "../constants/actionTypes";

let interval;

export function addQueuedFunction(func, args) {
    return (dispatch, getState) => {
        const {app} = getState();
        dispatch(toggleOffline(true));

        const key = func.name + Array.prototype.slice.call(args).join('|');

        if (app.queued_items.indexOf(key) == -1) {
            dispatch(addFunction(func, key));
        }

        if (!interval) {
            dispatch(initCheckOnline());
        }
    }
}

function toggleOffline(offline) {
    return {
        type: actionTypes.APP_TOGGLE_OFFLINE,
        time: new Date().getTime(),
        offline
    }
}

function addFunction(func, key) {
    return {
        type: actionTypes.APP_PUSH_OFFLINE_QUEUE,
        func,
        key
    }
}

function removeFunction(func) {
    return {
        type: actionTypes.APP_POP_OFFLINE_QUEUE,
        func
    }
}

function clearFunctions() {
    return {
        type: actionTypes.APP_CLEAR_OFFLINE_QUEUE
    }
}

function initCheckOnline() {
    return dispatch => {

        if (interval) return;

        interval = setInterval(() => {

            console.log("run")
            dispatch(checkOnline())

        }, 5000);
    }
}

function checkOnline() {
    return (dispatch, getState) => {
        const {app} = getState();

        if (!app.offline && app.queued_items.length == 0) {
            clearInterval(interval);
            interval = null;
            dispatch(clearFunctions);
        }

        const cur_time = (new Date()).getTime();

        if ((cur_time - app.last_checked) > 5000) {
            fetch("http://google.com")
                .then(res => {
                    dispatch(toggleOffline(false));

                        app.queued_items.forEach(function (key) {
                            const func = app.queued_functions[key];
                            dispatch(func());
                            dispatch(removeFunction(key));
                        })
                })
                .catch(err => {
                    dispatch(toggleOffline(true));
                })
        }
    }
}

export function isOnline() {
    return (dispatch) => {
        fetch("http://google.com")
            .then(res => {

            })
            .catch(err => {
                dispatch(toggleOffline(true));

                if (!interval) {
                    dispatch(initCheckOnline());
                }
            })
    }
}
