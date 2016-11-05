// @flow
import React, {Component} from 'react';
import classNames from 'classnames';
import Soundcloud from '../utils/soundcloud';
import Feed from '../components/Feed';
import PageHeader from '../components/PageHeader/PageHeader';
import configureStore from '../store/configureStore';
import * as actions from '../actions';


export default class FeedPage extends Component {

    render() {

        return (
            <div>
                <PageHeader title="Stream"/>
                <Feed />
            </div>
        );
    }
}
