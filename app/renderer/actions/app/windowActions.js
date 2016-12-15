import {ipcRenderer} from "electron";
import React from "react"
import * as actionTypes from "../../constants/actionTypes";
import Notifications from 'react-notification-system-redux';

export function minimize() {
    ipcRenderer.send('minimize');
}
export function maximize() {
    ipcRenderer.send('maximize');
}
export function close() {
    ipcRenderer.send('close');
}

export function initWatchers() {
    return dispatch => {
        dispatch(listenUpdate());
    }
}

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

function setUpdateAvailable(version) {
    return {
        type: actionTypes.APP_SET_UPDATE_AVAILABLE,
        version
    }
}