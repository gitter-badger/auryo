import {app} from "electron";
const settings = require('electron-settings');

import main from "./window/main.window"
import login from "./window/login.window"

import Ipc from "./ipc"

require("./env/" + process.env.NODE_ENV);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('ready', () => {
    Ipc.init(main,login);
    if (settings.hasSync("access_token")) {
        main.init();
    } else {
        login.init(main);
    }
});
