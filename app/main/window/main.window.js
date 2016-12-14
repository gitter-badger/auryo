const main = module.exports = {
    init,
    showLogin,
    win: null,

};

export default main;

import {BrowserWindow, shell} from "electron"
import {posCenter} from "../utils"
import {CLIENT_ID, CALLBACK, MAIN_WINDOW} from "../../config"
import AppUpdater from "../updater"
import settings from "electron-settings"
import url from "url"
import querystring from "querystring"

function init() {
    let m = false;

    installExtensions();

    if (!main.win) {
        let options = {
            show: false,
            width: 1190,
            height: 728,
            webPreferences: {
                webSecurity: false
            }
        };

        options = posCenter(options);

        main.win = new BrowserWindow(options);

        main.win.setMenu(null);

        main.win.on('closed', () => {
            main.win = null;
        });
    }


    if (settings.hasSync("access_token")) {
        showMain();
        m = true;
    } else {
        showLogin();
    }

    const handleRedirect = (e, newUrl) => {
        if (newUrl.indexOf("http://localhost:3716/oauth/callback") > -1) {
            const url_parts = url.parse(newUrl, true);
            const query = url_parts.query;

            if(query.error == "access_denied"){
                e.preventDefault();
                showLogin();
            }
        }

        if (newUrl != main.win.webContents.getURL() && m) {
            e.preventDefault();
            shell.openExternal(newUrl)
        }
    };

    main.win.webContents.on('will-navigate', handleRedirect);
    main.win.webContents.on('new-window', handleRedirect);

    main.win.webContents.on('did-finish-load', () => {
        main.win.show();
        main.win.focus();
        if (m && process.env.NODE_ENV != 'development') {
            new AppUpdater(main.win);
        }
    });

    main.win.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL, isMainFrame) => {
        if (errorDescription === 'ERR_INTERNET_DISCONNECTED' && !m) {
            main.win.loadURL(`file://${__dirname}/no_internet.html`)

        }
    });

    main.win.webContents.on('did-get-redirect-request', function (event, oldUrl, newUrl) {
        const url_parts = url.parse(newUrl, true);
        const query = url_parts.query;

        if (newUrl.indexOf("http://localhost:3716/oauth/callback") > -1) {
            handleCallback(newUrl);
        }
    });

}

function showLogin() {
    main.win.loadURL('https://soundcloud.com/connect?client_id=' + CLIENT_ID + '&response_type=token&scope=non-expiring&display=next&redirect_uri=' + CALLBACK);
}

function showMain() {

    main.win.loadURL(MAIN_WINDOW);

    if (process.env.NODE_ENV === 'development') {
        main.win.openDevTools();
        main.win.webContents.on('context-menu', (e, props) => {
            const {x, y} = props;

            Menu.buildFromTemplate([{
                label: 'Inspect element',
                click() {
                    main.win.inspectElement(x, y);
                }
            }]).popup(main.win);
        });
    }
}

function hide() {
    if (!main.win) return;
    main.win.hide()
}
function show() {
    if (!main.win) return;
    main.win.show()
}

const installExtensions = async() => {
    if (process.env.NODE_ENV === 'development') {
        const installer = require('electron-devtools-installer'); // eslint-disable-line global-require

        const extensions = [
            'REACT_DEVELOPER_TOOLS',
            'REDUX_DEVTOOLS'
        ];
        const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
        for (const name of extensions) {
            try {
                await installer.default(installer[name], forceDownload);
            } catch (e) {
            } // eslint-disable-line
        }
    }
};

function handleCallback(u) {
    const uri = url.parse(u);

    const raw_code = /access_token=([^&]*)/.exec(u) || null;
    const code = (raw_code && raw_code.length > 1) ? raw_code[1] : null;

    if (uri.hash && code) {

        const hash = uri.hash.substr(1);
        const token = querystring.parse(hash).access_token;

        settings.setSync("access_token", token);

        if (main.win) {

        }
        showMain();

    }
}