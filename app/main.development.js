import {app, BrowserWindow, Menu, shell, protocol, ipcMain, screen} from "electron";
import {CLIENT_ID,CALLBACK} from "./_shared/constants/config";
const settings = require('electron-settings');

const url = require('url');
const querystring = require('querystring');

import AppUpdater from "./updater"

let menu;
let loginWindow = null;
let mainWindow = null;

if (process.env.NODE_ENV === 'production') {
    const sourceMapSupport = require('source-map-support'); // eslint-disable-line
    sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development') {
    require('electron-debug')(); // eslint-disable-line global-require
    const path = require('path'); // eslint-disable-line
    const p = path.join(__dirname, '..', 'app', 'node_modules'); // eslint-disable-line
    require('module').globalPaths.push(p); // eslint-disable-line
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});


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

function doLogin() {
    let options = {
        width: 400,
        height: 500,
        resizable: false,
        webPreferences: {
            nodeIntegration: false,
            webSecurity: false
        }
    };

    options = posCenter(options);

    loginWindow = new BrowserWindow(options);

    loginWindow.setMenu(null);

    loginWindow.on('close', app.quit); // http://localhost:3716/oauth/callback
    loginWindow.loadURL('https://soundcloud.com/connect?client_id=' + CLIENT_ID + '&response_type=token&scope=non-expiring&display=next&redirect_uri=' + CALLBACK);

    loginWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL, isMainFrame) => {
        if (errorDescription === 'ERR_INTERNET_DISCONNECTED') {
            loginWindow.loadURL(`file://${__dirname}/no_internet.html`)

        }
    });
    loginWindow.webContents.on('did-get-redirect-request', function (event, oldUrl, newUrl) {
        handleCallback(newUrl);
    });
}

function handleCallback(u) {
    const uri = url.parse(u);

    const raw_code = /access_token=([^&]*)/.exec(u) || null;
    const code = (raw_code && raw_code.length > 1) ? raw_code[1] : null;

    if (uri.hash && code) {

        const hash = uri.hash.substr(1);
        const token = querystring.parse(hash).access_token;

        settings.setSync("access_token", token);
        if (loginWindow) {
            loginWindow.removeListener('close', app.quit);
            loginWindow.close();
        }
        init();

    }
}

function init() {
    installExtensions();

    let options = {
        show: false,
        width: 1190,
        height: 728,
        //frame: false,
        webPreferences: {
            webSecurity: false
        }
    };

    options = posCenter(options);

    mainWindow = new BrowserWindow(options);
    mainWindow.maximize();
    mainWindow.setMenu(null);

    new AppUpdater(mainWindow);

    const handleRedirect = (e, url) => {
        if(url != mainWindow.webContents.getURL()) {
            e.preventDefault();
            require('electron').shell.openExternal(url)
        }
    };

    mainWindow.webContents.on('will-navigate', handleRedirect);
    mainWindow.webContents.on('new-window', handleRedirect);

    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.show();
        mainWindow.focus();
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    mainWindow.loadURL(`file://${__dirname}/app.html`);

    if (process.env.NODE_ENV === 'development') {
        mainWindow.openDevTools();
        mainWindow.webContents.on('context-menu', (e, props) => {
            const {x, y} = props;

            Menu.buildFromTemplate([{
                label: 'Inspect element',
                click() {
                    mainWindow.inspectElement(x, y);
                }
            }]).popup(mainWindow);
        });
    }

}

app.on('ready', () => {

    if (settings.hasSync("access_token")) {
        init();
    } else {
        doLogin()
    }
});

ipcMain.on('ping', (event, arg) => {
    event.returnValue = settings.getSync("access_token");
});

ipcMain.on('logout', (event, arg) => {
    settings.deleteSync("access_token");
    if (mainWindow) {
        mainWindow.hide();
    }
    doLogin();
});

ipcMain.on('minimize', (event, arg) => {
    mainWindow.minimize();
});

ipcMain.on('maximize', (event, arg) => {
    if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
    } else {
        mainWindow.maximize();
    }
});

ipcMain.on('close', (event, arg) => {
    if (process.platform !== "darwin") {
        app.quit();
    } else {
        mainWindow = null;
    }
});

function posCenter(options) {

    const displays = screen.getAllDisplays();

    if (displays.length > 1) {
        const x = (displays[0].workArea.width - options.width) / 2;
        const y = (displays[0].workArea.height - options.height) / 2;
        options.x = x + displays[0].workArea.x;
        options.y = y + displays[0].workArea.y;
    }

    return options;
}
