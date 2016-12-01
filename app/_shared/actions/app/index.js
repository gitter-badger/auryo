import {toggleOffline, addQueuedFunction, isOnline} from "./offlineActions"
import * as actionTypes from "../../constants/actionTypes"

export {
    toggleOffline,
    addQueuedFunction,
    isOnline
}

export function setLoaded() {
    return {
        type:actionTypes.APP_SET_LOADED
    }
}
