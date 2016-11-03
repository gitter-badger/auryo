import {CLIENT_ID} from '../constants/Config';
var rp = 'request-promise';
import SC from 'soundcloud';
import React from 'react';

var SoundCloud = React.createClass({
    _endpoint: 'http://api.soundcloud.com/',
    _token: undefined,
    _clientId: undefined,

    _init: function (token) {
        this._token = token;
        this._clientId = CLIENT_ID;
    }
});


SoundCloud.prototype.makeRequest = function (url, options) {
    var self = this;
    options = options || {};

    if (typeof url === 'object')
        options = url;
    else if (typeof url === 'string' && url.indexOf('://') === -1)
        options.url = this._endpoint + url;
    else if (typeof url === 'string' && url.indexOf('://') !== -1)
        options.url = url;

    var defaults = {
        'method': 'GET',
        'json': true,
        'qs': _.defaults(options.qs || {}, {
            'client_id': self._clientId,
            'oauth_token': self._token,
            'limit': 50
        })
    };

    options = _.defaults(options, defaults);

    return rp(options)
};