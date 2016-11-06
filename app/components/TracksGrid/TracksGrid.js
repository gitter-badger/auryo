import React, {Component, PropTypes} from 'react';
import TrackGridItem from '../../components/TrackGridItem/TrackGridItem';
import {fetchSongsIfNeeded} from '../../actions/auth.actions';
import {playTrack} from '../../actions';
import infiniteScroll from '../../components/InfiniteScroll';
import Spinner from '../Spinner/index';
import LazyLoad from 'react-lazyload';


class TracksGrid extends Component {

    playTrack(i, e) {
        e.preventDefault();
        const {playlist, dispatch} = this.props;
        dispatch(playTrack(playlist, i));
    }

    render() {

        const {
            auth,
            dispatch,
            tracks,
            users,
            playlist,
            playlists,
            scrollFunc,
            playingSongId
        } = this.props;

        const items = playlist in playlists ? playlists[playlist].items : [];
        const isFetching = playlists[playlist].isFetching;
        // TODO find a good way for lazy loading

        return (
            <div className="songs">
                <div className="row">
                    {

                        items.map((songId, i) => {

                            const track = tracks[songId];

                            const scrollFunc = fetchSongsIfNeeded.bind(null, playlist);
                            track.user = users[track.user_id];
                            track.from_user = users[track.from];
                            const playTrackFunc = this.playTrack.bind(this, i);

                            return (
                                <LazyLoad
                                    key={songId + '-' + i}
                                    height={280}
                                    offset={280}
                                    placeholder={<Spinner card={true}/>}>
                                    <TrackGridItem
                                        playTrackFunc={playTrackFunc}
                                        auth={auth}
                                        dispatch={dispatch}
                                        isPlaying={track.id === playingSongId}
                                        scrollFunc={scrollFunc}

                                        track={track} />
                                </LazyLoad>
                            );
                        })
                    }
                </div>
                {isFetching ? <Spinner /> : null}
            </div>
        );
    }
}

TracksGrid.propTypes = {
    auth: PropTypes.object.isRequired,
    height: PropTypes.number,
    tracks: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    playingSongId: PropTypes.number,
    users: PropTypes.object.isRequired,
    playlist: PropTypes.string.isRequired,
    playlists: PropTypes.object.isRequired,
    scrollFunc: PropTypes.func.isRequired
};
export default infiniteScroll(TracksGrid);
