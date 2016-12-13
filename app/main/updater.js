import {app, BrowserWindow as BrowserWindowElectron, ipcMain} from "electron";
import http from "http"

import * as os from "os";
import {autoUpdater} from "electron-auto-updater";

const UPDATE_SERVER_HOST = "auryo-updater.herokuapp.com";

export default class AppUpdater {
    constructor(window) {
        const _this = this;
        const platform = os.platform();
        const currentVersion = app.getVersion();
        const linux_arch = (os.arch() == "x64") ? "amd64" : "i386";

        if (platform === "linux") {
            window.webContents.once("did-frame-finish-load", (event) => {
                http.get({
                    host: UPDATE_SERVER_HOST
                }, response => {
                    let json = '';
                    response.on('data', function (d) {
                        json += d;
                    });
                    response.on('end', function () {

                        const obj = JSON.parse(json);

                        if (obj.latest.name != currentVersion) {
                            let deb = null;
                            let rpm = null;

                            if(obj.latest.assets){
                                obj.latest.assets.forEach(function(element) {
                                    if(element.name.endsWith(".deb")){
                                        deb = element.browser_download_url;
                                    }
                                    if(element.name.endsWith(".rpm")){
                                        rpm = element.browser_download_url;
                                    }
                                });
                            }

                            window.webContents.send('update-status', {
                                status: 'update-available-linux',
                                version: obj.latest.name,
                                current_version: currentVersion,
                                rpm_url: rpm,
                                deb_url: deb
                            });
                        }
                    });
                });
            });


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
                version: version,
                current_version: currentVersion
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
            autoUpdater.setFeedURL(`https://${UPDATE_SERVER_HOST}/update/darwin?version=${currentVersion}`)
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