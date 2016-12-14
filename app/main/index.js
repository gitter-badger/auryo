import {app} from "electron";
const settings = require('electron-settings');

import main from "./window/main.window"

import Ipc from "./ipc"

require("./env/" + process.env.NODE_ENV);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('ready', () => {
    Ipc.init(main);
    main.init();
});
