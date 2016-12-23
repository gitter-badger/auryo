import {ipcRenderer} from "electron"
import Notifications from 'react-notification-system-redux'

import * as actionTypes from "../../constants/actionTypes"

export function minimize() {
    ipcRenderer.send('minimize');
}
export function maximize() {
    ipcRenderer.send('maximize');
}
export function close() {
    ipcRenderer.send('close');
}

/**
 * Wrapper for listener functions from electron
 *
 * @returns {function(*)}
 */
export function initWatchers() {
    return dispatch => {
        dispatch(listenUpdate());
    }
}

/**
 * Check if electron pings us the update. If so, show a notification.
 *
 * @returns {function(*)}
 */
export function listenUpdate() {
    return dispatch => {
        ipcRenderer.once('update-status', function (event, obj) {
            dispatch(setUpdateAvailable(obj.version));

            let notification = {
                title: "Update available v" + obj.version,
                message: "Current version: " + obj.current_version,
                autoDismiss: 0,
            };

            if (obj.status == "update-available-linux") {
                notification.children = (
                    <div className="notification-children">
                        <span>Download</span>
                        {(obj.deb_url) ? <a href={obj.deb_url} className="notification-action-button">.deb</a> : null}
                        {(obj.rpm_url) ? <a href={obj.rpm_url} className="notification-action-button">.rpm</a> : null}
                    </div>
                )
            } else {
                notification.action = {
                    label: 'Update now',
                    callback: () => ipcRenderer.send("do-update")
                }
            }

            dispatch(Notifications.success(notification));
        });
    }
}

/**
 * Set app update available
 *
 * @param version
 * @returns {{type, version: *}}
 */
function setUpdateAvailable(version) {
    return {
        type: actionTypes.APP_SET_UPDATE_AVAILABLE,
        version
    }
}