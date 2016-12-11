import {ipcRenderer} from "electron";
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

export function initWatchers(){
    return dispatch => {
        dispatch(listenUpdate());
    }
}

export function listenUpdate() {
    return dispatch => {
        ipcRenderer.once('update-status',function(event,obj){
            dispatch(setUpdateAvailable(obj.version));

            dispatch(Notifications.success({
                title: "Update available v" + obj.version,
                level: 'success',
                autoDismiss:0,
                action: {
                    label: 'Update now',
                    callback: () => ipcRenderer.send("do-update")
                }
            }));
        });
    }
}

function setUpdateAvailable(version){
    return {
        type: actionTypes.APP_SET_UPDATE_AVAILABLE,
        version
    }
}