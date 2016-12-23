import {actionTypes}  from "../../constants"

export * from "./offlineActions"
export * from "./windowActions"

/**
 * Set app app loaded to true
 *
 * @returns {{type}}
 */
export function setLoaded() {
    return {
        type: actionTypes.APP_SET_LOADED
    }
}
