const main = module.exports = {
    init,
    win: null
};

export default main;

import {BrowserWindow} from "electron"
import settings from "electron-settings"
import {posCenter} from "../utils"
import {CLIENT_ID,CALLBACK} from "../../config"
import url from "url"
import querystring from "querystring"

function init(mainwindow){
    let options = {
        width: 400,
        height: 500,
        resizable: false,
        webPreferences: {
            nodeIntegration: false,
            webSecurity: true
        }
    };

    options = posCenter(options);

    main.win = new BrowserWindow(options);

    main.win.setMenu(null);
    main.win.openDevTools();

    main.win.loadURL('https://soundcloud.com/connect?client_id=' + CLIENT_ID + '&response_type=token&scope=non-expiring&display=next&redirect_uri=' + CALLBACK);

    main.win.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL, isMainFrame) => {
        if (errorDescription === 'ERR_INTERNET_DISCONNECTED') {
            main.win.loadURL(`file://${__dirname}/no_internet.html`)

        }
    });


    main.win.webContents.on('did-get-redirect-request', function (event, oldUrl, newUrl) {
        if(newUrl.indexOf("http://localhost:3716/oauth/callback") > -1){
           handleCallback(newUrl,mainwindow);
        }
    });

    main.win.on('closed', () => {
        main.win = null;
    })
}

function handleCallback(u,mainwindow) {
    const uri = url.parse(u);

    const raw_code = /access_token=([^&]*)/.exec(u) || null;
    const code = (raw_code && raw_code.length > 1) ? raw_code[1] : null;

    if (uri.hash && code) {

        const hash = uri.hash.substr(1);
        const token = querystring.parse(hash).access_token;

        settings.setSync("access_token", token);

        if (main.win) {
            main.win.close();
            main.win = null;
        }
        mainwindow.init()

    }
}