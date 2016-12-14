import path from "path"

require("electron-debug")();

const p = path.join(__dirname, '..', 'app', 'node_modules');
require('module').globalPaths.push(p);