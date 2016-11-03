import {CLIENT_ID} from '../constants/Config';
import {CHART_SORT_TYPE} from '../constants/Soundcloud';
import React from 'react';

var SoundCloud = function () {

    this._endpoint = 'http://api.soundcloud.com/';
    this._v2_endpoint = "https://api-v2.soundcloud.com/";
    this._token = undefined;
    this._clientId = undefined;

};

SoundCloud.prototype.initialize = function (token) {
    this._token = token;
    this._clientId = CLIENT_ID;
};

SoundCloud.prototype.getChartsUrl = function (genre, sort = "top") {
    return this._v2_endpoint + "charts?kind=" + sort + "&genre=soundcloud:genres:" + genre + "&client_id=" + this._clientId
};

SoundCloud.prototype.getFeedUrl = function (limit = 25) {
    return this._endpoint + "me/activities?limit=" + limit + "&oauth_token=" + this._token
};

SoundCloud.prototype.getLikesUrl = function () {
    return this._endpoint + "me/favorites?oauth_token=" + this._token;
};

SoundCloud.prototype.getPlaylistUrl = function () {
    return this._endpoint + "me/playlists?oauth_token=" + this._token;
};

SoundCloud.prototype.getRelatedUrl = function (trackID) {
    return this._endpoint + "tracks/" + trackID + "/related?client_id=" + this._clientId;
};

/*
 SoundCloud.prototype.toggleLikeTrack = function(track) {
 var method = track.user_favorite ? 'DELETE' : 'PUT';
 return this.makeRequest('me/favorites/' + track.id, { method : method });
 }
 */

module.exports = new SoundCloud();