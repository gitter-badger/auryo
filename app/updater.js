import {app, BrowserWindow as BrowserWindowElectron} from "electron";
import * as os from "os";
import {autoUpdater} from "electron-auto-updater";

const UPDATE_SERVER_HOST = "auryo-updater.herokuapp.com";

export default class AppUpdater {
    constructor(window) {

        const platform = os.platform();
        if (platform === "linux") {
            return
        }

        const version = app.getVersion();
        autoUpdater.addListener("update-available", (event) => {
            console.log("A new update is available")
        });
        autoUpdater.addListener("update-downloaded", (event, releaseNotes, releaseName, releaseDate, updateURL) => {
            console.log("quitAndInstall");
            autoUpdater.quitAndInstall();
            return true

        });
        autoUpdater.addListener("error", (error) => {
            console.log(error)
        });
        autoUpdater.addListener("checking-for-update", (event) => {
            console.log("checking-for-update")
        });
        autoUpdater.addListener("update-not-available", () => {
            console.log("update-not-available")
        });

        if (platform === "darwin") {
            autoUpdater.setFeedURL(`https://${UPDATE_SERVER_HOST}/update/${platform}_${os.arch()}/${version}`)
        }

        window.webContents.once("did-frame-finish-load", (event) => {
            console.log("checking-for-updates");
            autoUpdater.checkForUpdates()
        })
    }
}