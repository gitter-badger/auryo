import {CLIENT_ID} from "../constants/config";
import {IMAGE_SIZES} from "../constants/Soundcloud";
import React from "react";
import linkifyHtml from "linkifyjs/html";

const _endpoint = 'http://api.soundcloud.com/';
const _v2_endpoint = "https://api-v2.soundcloud.com/";

var _token = undefined;

export function initialize(token) {
  _token = token;

}

export function getTrackUrl(trackID) {
  return _endpoint + "tracks/" + trackID + "?client_id=" + CLIENT_ID;
}

export function getChartsUrl(genre, sort = "top") {
  return _v2_endpoint + "charts?kind=" + sort + "&genre=soundcloud:genres:" + genre + "&client_id=" + CLIENT_ID
}

export function getFeedUrl(limit = 50) {
  return _endpoint + "e1/me/stream.json?limit=" + limit + "&oauth_token=" + _token;
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

export function getFollowingsUrl() {
  return _endpoint + "me/followings?oauth_token=" + _token;
}

export function appendToken(url) {
  return url + "&oauth_token=" + _token;
}

export function appendClientId(url) {
  return url + "?client_id=" + CLIENT_ID;
}

export function updateLikeUrl(trackID) {
  return _endpoint + "me/favorites/" + trackID + "?oauth_token=" + _token;
}
export function updateFollowingUrl(userID) {
  return _endpoint + "me/followings/" + userID + "?oauth_token=" + _token;
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

export function formatDescription(input) {
  return {
    __html: linkifyHtml(input.replace(/(\r\n|\n|\r)/gm, "<br>"))
  };
}

export function isLiked(trackID, likes) {
  return (trackID in likes) && likes[trackID] == 1;
}

export function isFollowing(userID, followings) {
  return (userID in followings) && followings[userID] == 1;
}
