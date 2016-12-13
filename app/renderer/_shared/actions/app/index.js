import {toggleOffline, addQueuedFunction, isOnline} from "./offlineActions"
import {initWatchers} from "./windowActions"
import * as actionTypes from "../../constants/actionTypes"

export {
    toggleOffline,
    addQueuedFunction,
    isOnline,
    initWatchers
}

export function setLoaded() {
    return {
        type:actionTypes.APP_SET_LOADED
    }
}
