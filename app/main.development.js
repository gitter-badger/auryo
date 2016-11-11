import {app, BrowserWindow, Menu, shell, protocol, ipcMain} from "electron";
import {CLIENT_ID} from "./constants/Config";
const settings = require('electron-settings');


var url = require('url');
var querystring = require('querystring');

let menu;
let template;
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
  mainWindow.loadURL('https://soundcloud.com/connect?client_id=' + CLIENT_ID + '&response_type=token&scope=non-expiring&display=next&redirect_uri=cumulus://oauth/callback')
}

function init() {
  installExtensions();

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
  /**
   * register Cumulus protocol
   */
  protocol.registerHttpProtocol('cumulus', function (req) {
    var uri = url.parse(req.url);

    switch (uri.host) {
      case 'oauth':
        if (uri.pathname !== '/callback') return;

        // parse access token
        var hash = uri.hash.substr(1);
        var token = querystring.parse(hash).access_token;

        settings.setSync("access_token", token);

        init();

        break;
    }

  });

  mainWindow = new BrowserWindow({
    width: 1024,
    height: 728,
    frame:false,
    webPreferences: {
      webSecurity: false
    }
  });
  mainWindow.setMenu(null);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.on('close', app.quit);

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
    mainWindow.hide();
  }
});
