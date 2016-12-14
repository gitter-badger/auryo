import {ipcMain} from "electron"
import settings from 'electron-settings'


export default {
    init
}

function init(main,login){

    ipcMain.on('ping', (event, arg) => {
        event.returnValue = settings.getSync("access_token");
    });

    ipcMain.on('logout', (event, arg) => {
        settings.deleteSync("access_token");
        if (main.win) {
            main.win.hide();
        }
        login.init(main);
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