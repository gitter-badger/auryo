import React, {Component, PropTypes} from 'react';
import SongCards from '../../components/SongCards';
import Spinner from '../../components/Spinner';

class Feed extends Component {

    /*componentWillMount() {
     const { dispatch, playlist, playlists } = this.props;
     if (!(playlist in playlists) || playlists[playlist].items.length === 0) {
     dispatch(fetchSongsIfNeeded(playlist));
     }
     }

     componentWillReceiveProps(nextProps) {
     const { dispatch, playlist, playlists } = this.props;
     if (playlist !== nextProps.playlist) {
     if (!(nextProps.playlist in playlists) || playlists[nextProps.playlist].items.length === 0) {
     dispatch(fetchSongsIfNeeded(nextProps.playlist));
     }
     }
     }*/

    render() {

        return (
            <SongCards {...this.props} />
        );
    }
}

Feed.propTypes = {
    auth: PropTypes.object.isRequired,
    height: PropTypes.number,
    dispatch: PropTypes.func.isRequired,
    tracks: PropTypes.object.isRequired,
    track_info: PropTypes.object.isRequired,
    users: PropTypes.object.isRequired,
    playlist: PropTypes.object.isRequired,
    playlists: PropTypes.object.isRequired,
    scrollFunc: PropTypes.func.isRequired
};

export default Feed;