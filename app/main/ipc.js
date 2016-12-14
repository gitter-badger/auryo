import {ipcMain} from "electron"
import settings from 'electron-settings'


export default {
    init
}

function init(main){

    ipcMain.on('ping', (event, arg) => {
        event.returnValue = settings.getSync("access_token");
    });

    ipcMain.on('logout', (event, arg) => {
        settings.deleteSync("access_token");
        main.init();
    });

    ipcMain.on('minimize', (event, arg) => {
        main.win.minimize();
    });

    ipcMain.on('maximize', (event, arg) => {
        if (main.win.isMaximized()) {
            main.win.unmaximize();
        } else {
            main.win.maximize();
        }
    });

    ipcMain.on('close', (event, arg) => {
        if (process.platform !== "darwin") {
            app.quit();
        } else {
            main.win = null;
        }
    });
}