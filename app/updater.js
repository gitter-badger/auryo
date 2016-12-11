import {app, BrowserWindow as BrowserWindowElectron, ipcMain} from "electron";

import * as os from "os";
import {autoUpdater} from "electron-auto-updater";

const UPDATE_SERVER_HOST = "auryo-updater.herokuapp.com";

export default class AppUpdater {
    constructor(window) {
        const _this = this;
        const platform = os.platform();
        if (platform === "linux") {
            return
        }

        const version = app.getVersion();
        autoUpdater.addListener("update-available", (event) => {
            this.has_update = true;
            console.log("A new update is available")
        });
        autoUpdater.addListener("update-downloaded", (event, releaseNotes, version, releaseDate, updateURL) => {
            window.webContents.send('update-status', {
                status: 'update-available',
                version: version
            });

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
            autoUpdater.checkForUpdates()
        });

        ipcMain.on('do-update', (event, arg) => {
            if (_this.has_update) {
                autoUpdater.quitAndInstall();
            }
        });

    }
}