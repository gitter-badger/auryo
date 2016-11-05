import {getMeUrl, getFeedUrl} from '../utils/soundcloud';
import {arrayOf, normalize} from 'normalizr';
import * as actionTypes from '../constants/actionTypes';
import {setTracks} from '../actions/track';
import trackInfoSchema from '../schemas/trackInfo';
import  {merge} from 'lodash';

function setMe(user) {
    return {
        type: actionTypes.ME_SET,
        user
    };
}

export function auth() {
    return dispatch => {
        dispatch(fetchMe());
        dispatch(fetchStream());
    };
}

function fetchMe() {
    return dispatch => {
        return fetch(getMeUrl())
            .then((response) => response.json())
            .then((data) => {
                dispatch(setMe(data));
            });
    }
}

function fetchStream() {
    return dispatch => {
        return fetch(getFeedUrl())
            .then((response) => response.json())
            .then(json => {
                const collection = json.collection
                    .filter(song => (song.track && song.track.kind === 'track') && song.track.streamable);
                //return { futureUrl: `${json.future_href}&oauth_token=${accessToken}`, collection };
                return collection;
            })
            .then(data => {
                console.log("prenorm",data);
                const normalized = normalize(data, arrayOf(trackInfoSchema));
                dispatch(setTracks(normalized.entities, normalized.result));
            })
            .catch(err => {
                throw err;
            });
    };
}