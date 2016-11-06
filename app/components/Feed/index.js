import React, {Component, PropTypes} from 'react';
import TracksGrid from '../../components/TracksGrid/TracksGrid';
import {fetchSongsIfNeeded} from '../../actions/auth.actions';

class Feed extends Component {

    componentWillMount() {
        const {dispatch, playlist, playlists} = this.props;
        if (!(playlist in playlists) || playlists[playlist].items.length === 0) {
            dispatch(fetchSongsIfNeeded(playlist));
        }
    }

    componentWillReceiveProps(nextProps) {
        const {dispatch, playlist, playlists} = this.props;
        if (playlist !== nextProps.playlist) {
            if (!(nextProps.playlist in playlists) || playlists[nextProps.playlist].items.length === 0) {
                dispatch(fetchSongsIfNeeded(nextProps.playlist));
            }
        }
    }

    render() {

        return (
            <TracksGrid {...this.props} />
        );
    }
}

Feed.propTypes = {
    auth: PropTypes.object.isRequired,
    height: PropTypes.number,
    tracks: PropTypes.object.isRequired,
    users: PropTypes.object.isRequired,
    playingSongId: PropTypes.number,
    playlist: PropTypes.string.isRequired,
    playlists: PropTypes.object.isRequired,
    scrollFunc: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired
};

export default Feed;
