import {CLIENT_ID} from '../constants/Config';
import {CHART_SORT_TYPE, IMAGE_SIZES} from '../constants/Soundcloud';
import React from 'react';

const _endpoint = 'http://api.soundcloud.com/';
const _v2_endpoint = "https://api-v2.soundcloud.com/";

var _token = undefined;

export function initialize(token) {
    _token = token;

}

export function getChartsUrl(genre, sort = "top") {
    return _v2_endpoint + "charts?kind=" + sort + "&genre=soundcloud:genres:" + genre + "&client_id=" + CLIENT_ID
}

export function getFeedUrl(limit = 25) {
  return  _endpoint + "e1/me/stream.json?&limit=" + limit + "&oauth_token=" + _token;
    //return _v2_endpoint + "stream?limit=" + limit + "&oauth_token=" + _token;
    //return _endpoint + "me/activities?limit=" + limit + "&oauth_token=" + _token
}

export function getLikesUrl() {
    return _endpoint + "me/favorites?oauth_token=" + _token;
}

export function getPlaylistUrl() {
    return _endpoint + "me/playlists?oauth_token=" + _token;
}

export function getRelatedUrl(trackID) {
    return _endpoint + "tracks/" + trackID + "/related?client_id=" + CLIENT_ID;
}

export function getMeUrl() {
    return _endpoint + "me?oauth_token=" + _token;
}

export function getFollowingsUrl(){
    return _endpoint + "me/followings?oauth_token=" + _token;
}

export function appendToken(url){
    return url + "&oauth_token=" + _token;
}

export function getImageUrl(s, size = null) {
    let str = s;
    if (!str) {
        return '';
    }

    str = str.replace('http:', '');

    switch (size) {
        case IMAGE_SIZES.LARGE:
            return str.replace('large', IMAGE_SIZES.LARGE);
        case IMAGE_SIZES.XLARGE:
            return str.replace('large', IMAGE_SIZES.XLARGE);
        default:
            return str;
    }
}

