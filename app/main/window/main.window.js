const main = module.exports = {
    init,
    win: null
};

export default main;

import {BrowserWindow,shell} from "electron"
import {posCenter} from "../utils"
import {MAIN_WINDOW} from "../../config"
import AppUpdater from "../updater"

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

    main.win = new BrowserWindow(options);
    main.win.maximize();
    main.win.setMenu(null);

    const handleRedirect = (e, url) => {
        if (url != main.win.webContents.getURL()) {
            e.preventDefault();
            shell.openExternal(url)
        }
    };

    main.win.webContents.on('will-navigate', handleRedirect);
    main.win.webContents.on('new-window', handleRedirect);

    main.win.webContents.on('did-finish-load', () => {
        main.win.show();
        main.win.focus();
        new AppUpdater(main.win);
    });

    main.win.on('closed', () => {
        main.win = null;
    });

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

function hide () {
    if (!main.win) return;
    main.win.hide()
}
function show () {
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