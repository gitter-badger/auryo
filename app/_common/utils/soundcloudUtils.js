import {CLIENT_ID} from "../constants/config";
import {IMAGE_SIZES} from "../constants/Soundcloud";
import React from "react";
import linkifyHtml from "linkifyjs/html";
import escape from "escape-html";

const _endpoint = 'http://api.soundcloud.com/';
const _v2_endpoint = "https://api-v2.soundcloud.com/";

let _token = undefined;

export function initialize(token) {
    _token = token;

}

function makeUrl(uri, options, v2) {
    if (options.client_id) options.client_id = CLIENT_ID;
    if (options.oauth_token) options.oauth_token = _token;

    let url = _endpoint;

    if (v2) url += _v2_endpoint;

    // add uri
    url += uri;

    // Add query params
    url += "?" + Object.keys(options).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(options[k])}`).join('&');

    return url;
}


export function getTrackUrl(trackID) {
    return makeUrl("tracks/" + trackID, {
        client_id: true
    });
}

export function getChartsUrl(genre, sort = "top") {
    return makeUrl("charts/", {
        client_id: true,
        kind: sort,
        genre: "soundcloud:genres:" + genre
    }, true);
}

export function getFeedUrl(limit = 50) {
    return makeUrl("e1/me/stream.json", {
        limit: limit,
        oauth_token: true
    });
    //return _v2_endpoint + "stream?limit=" + limit + "&oauth_token=" + _token;
    //return _endpoint + "me/activities?limit=" + limit + "&oauth_token=" + _token
}

export function getLikesUrl() {
    return makeUrl("me/favorites", {
        oauth_token: true
    });
}

export function getPlaylistUrl() {
    return makeUrl("me/playlists", {
        oauth_token: true
    });
}

export function getRelatedUrl(trackID) {
    return makeUrl("tracks/" + trackID + "/related", {
        client_id: true
    });
}
export function getCommentsUrl(trackID, limit = 20) {
    return makeUrl("tracks/" + trackID + "/comments", {
        client_id: true,
        linked_partitioning: 1,
        limit: limit
    });
}

export function getMeUrl() {
    return makeUrl("me", {
        oauth_token: true
    });
}

export function getFollowingsUrl() {
    return makeUrl("me/followings", {
        oauth_token: true
    });
}

export function updateLikeUrl(trackID) {
    return makeUrl("me/favorites/" + trackID, {
        oauth_token: true
    });
}
export function updateFollowingUrl(userID) {
    return makeUrl("me/followings/" + userID, {
        oauth_token: true
    });
}

export function appendToken(url) {
    return url + "&oauth_token=" + _token;
}

export function appendClientId(url) {
    return url + "?client_id=" + CLIENT_ID;
}

export function getImageUrl(track, size = null) {
    let s;
    if (typeof track == "object") {
        s = track.artwork_url;

        if (!track.artwork_url || track.artwork_url == null && track.user) {
            s = track.user.avatar_url;
        }
    } else {
        s = track;
    }


    let str = s;
    if (!str) {
        return '';
    }
    if (str.indexOf("default_avatar") > -1) {
        return str
    }

    str = str.replace('http:', '');


    switch (size) {
        case IMAGE_SIZES.LARGE:
            return str.replace('large', IMAGE_SIZES.LARGE);
        case IMAGE_SIZES.XLARGE:
            return str.replace('large', IMAGE_SIZES.XLARGE);
        case IMAGE_SIZES.MEDIUM:
            return str.replace('large', IMAGE_SIZES.MEDIUM);
        case IMAGE_SIZES.XSMALL:
            return str.replace('large', IMAGE_SIZES.XSMALL);
        case IMAGE_SIZES.SMALL:
            return str;
        default:
            return str;
    }
}

/*
 * Util functions
 */
// TODO link usernames with @
export function formatDescription(input) {
    return {
        __html: linkifyHtml(escape(input).replace(/(\r\n|\n|\r)/gm, "<br>"))
    };
}

export function isLiked(trackID, likes) {
    return (trackID in likes) && likes[trackID] == 1;
}

export function isFollowing(userID, followings) {
    return (userID in followings) && followings[userID] == 1;
}
