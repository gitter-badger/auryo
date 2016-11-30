import * as actionTypes from "../../constants/actionTypes";

let interval;

/**
 * Add a function from a failed request to the queue
 *
 * @param func
 * @param args
 * @returns {function(*, *)}
 */
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

/**
 * Toggle the site on/offline
 *
 * @param offline
 * @returns {{type, time: number, offline: *}}
 */
export function toggleOffline(offline) {
    return {
        type: actionTypes.APP_TOGGLE_OFFLINE,
        time: new Date().getTime(),
        offline
    }
}

/**
 * Add a function to the queue
 *
 * @param func
 * @param key
 * @returns {{type, func: *, key: *}}
 */
function addFunction(func, key) {
    return {
        type: actionTypes.APP_PUSH_OFFLINE_QUEUE,
        func,
        key
    }
}

/**
 * Remove a function from the queue
 *
 * @param key
 * @returns {{type, key: *}}
 */
function removeFunction(key) {
    return {
        type: actionTypes.APP_POP_OFFLINE_QUEUE,
        key
    }
}

/**
 * Clear the queue
 *
 * @returns {{type}}
 */
function clearFunctions() {
    return {
        type: actionTypes.APP_CLEAR_OFFLINE_QUEUE
    }
}

/**
 * Initialize the check interval for when the site is offline
 *
 * @returns {function(*)}
 */
function initCheckOnline() {
    return dispatch => {

        if (interval) return;

        interval = setInterval(() => {

            dispatch(checkOnline())

        }, 5000);
    }
}

/**
 * Check if we can reach google.com, if so dispatch & remove the queued functions
 *
 * @returns {function(*=, *)}
 */
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
                            dispatch(removeFunction(key));
                            dispatch(func());
                        })
                })
                .catch(err => {
                    dispatch(toggleOffline(true));
                })
        }
    }
}

/**
 * Ping google.com to check if online. If not online, try and start the interval.
 *
 * @param func
 * @returns {function(*)}
 */
export function isOnline(func) {
    return (dispatch) => {
        fetch("http://google.com")
            .then(res => {
                dispatch(toggleOffline(false));

                if(func){
                    dispatch(func());
                }
            })
            .catch(err => {
                dispatch(toggleOffline(true));

                if (!interval) {
                    dispatch(initCheckOnline());
                }
            })
    }
}
