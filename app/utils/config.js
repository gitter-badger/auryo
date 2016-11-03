'use strict';

import {app} from 'electron';
var fs = require('fs');

var CONFIG_FILE = app.getPath('userData') + '/config.json';

class Config {

    static set = function (key, value, callback) {

        var data = {};
        data[key] = value;

        fs.writeFile(CONFIG_FILE, JSON.stringify(data), function (err) {
            if (err)
                return callback(err);

            callback(null);
        });

    };
    static get = function (key, callback) {

        fs.readFile(CONFIG_FILE, function (err, data) {

            if (err) {
                switch (err.code) {
                    // if the config file doesn't exist, we asssume undefined for the key value
                    case 'ENOENT':
                        return callback(null, undefined);
                    default:
                        return callback(err);
                }
            }

            data = JSON.parse(data);

            return callback(null, data[key]);
        })

    }
}

export default Config;