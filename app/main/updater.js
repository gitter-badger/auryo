import {app, BrowserWindow as BrowserWindowElectron, ipcMain} from "electron";
import http from "http"
import { gt as isVersionGreaterThan, valid as parseVersion } from "semver"

import * as os from "os";
import {autoUpdater} from "electron-auto-updater";

const UPDATE_SERVER_HOST = "auryo-updater.herokuapp.com";

export default class AppUpdater {
    constructor(window) {

        //noinspection JSUnresolvedVariable
        this.platform = os.platform();
        this.currentVersion = parseVersion(app.getVersion());

        const linux_arch = (os.arch() == "x64") ? "amd64" : "i386";

        if (this.platform === "linux") {
            this.updateLinux();
        } else {

            autoUpdater.addListener("update-available", (event) => {
                this.has_update = true;
                console.log("A new update is available")
            });
            autoUpdater.addListener("update-downloaded", (event, releaseNotes, version, releaseDate, updateURL) => {
                window.webContents.send('update-status', {
                    status: 'update-available',
                    version: version,
                    current_version: this.currentVersion
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

            if (this.platform === "darwin") {
                autoUpdater.setFeedURL(`https://${UPDATE_SERVER_HOST}/update/darwin?version=${this.currentVersion}`)
            }

            window.webContents.once("did-frame-finish-load", (event) => {
                autoUpdater.checkForUpdates()
            });

            ipcMain.on('do-update', (event, arg) => {
                if (this.has_update) {
                    autoUpdater.quitAndInstall();
                }
            });

        }

    }

    updateLinux(){
        http.get({
            host: UPDATE_SERVER_HOST
        }, response => {
            let json = '';
            response.on('data', function (d) {
                json += d;
            });
            response.on('end', function () {

                const obj = JSON.parse(json);
                const latest = parseVersion(obj.latest.name);

                if (obj.latest.name && isVersionGreaterThan(latest,this.currentVersion)) {
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
                        version: latest,
                        current_version: this.currentVersion,
                        rpm_url: rpm,
                        deb_url: deb
                    });
                }
            });
        });
    }
}