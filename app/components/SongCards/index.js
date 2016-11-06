import React, {Component, PropTypes} from 'react';
import SongCard from '../../components/SongCard';
import {fetchSongsIfNeeded} from '../../actions/auth.actions';
import infiniteScroll from '../../components/InfiniteScroll';
import Spinner from '../Spinner/index';
import ReactList from 'react-list';


class SongCards extends Component {

    /*onstructor(props) {
     super(props);
     this.getScrollState = this.getScrollState.bind(this);
     this.onScroll = this.onScroll.bind(this);

     const { playlist } = this.props;
     const items = playlist.items;
     this.state = {
     end: items.length,
     paddingBottom: 0,
     paddingTop: 0,
     start: 0,
     };
     }

     componentDidMount() {
     window.addEventListener('scroll', this.onScroll, false);
     }

     componentWillReceiveProps(nextProps) {
     const { end, paddingBottom, paddingTop, start } = this.getScrollState(nextProps);
     if (paddingTop !== this.state.paddingTop
     || paddingBottom !== this.state.paddingBottom
     || start !== this.state.start
     || end !== this.state.end) {
     this.setState({
     end,
     paddingBottom,
     paddingTop,
     start,
     });
     }
     }

     componentWillUnmount() {
     window.removeEventListener('scroll', this.onScroll, false);
     }

     onScroll() {
     const { end, paddingBottom, paddingTop, start } = this.getScrollState(this.props);
     if (paddingTop !== this.state.paddingTop
     || paddingBottom !== this.state.paddingBottom
     || end !== this.state.end
     || start !== this.state.start) {
     this.setState({
     end,
     paddingBottom,
     paddingTop,
     start,
     });
     }
     }

     getScrollState(props) {
     const { height, playlists, playlist } = props;
     const items = playlist.items;

     const MARGIN_TOP = 20;
     const ROW_HEIGHT = 132;
     const ITEMS_PER_ROW = 5;
     const scrollY = window.scrollY;

     let paddingTop = 0;
     let paddingBottom = 0;
     let start = 0;
     let end = items.length;

     if ((scrollY - ((ROW_HEIGHT * 3) + (MARGIN_TOP * 2))) > 0) {
     const rowsToPad = Math.floor(
     (scrollY - ((ROW_HEIGHT * 2) + (MARGIN_TOP))) / (ROW_HEIGHT + MARGIN_TOP)
     );
     paddingTop = rowsToPad * (ROW_HEIGHT + MARGIN_TOP);
     start = rowsToPad * ITEMS_PER_ROW;
     }

     const rowsOnScreen = Math.ceil(height / (ROW_HEIGHT + MARGIN_TOP));
     const itemsToShow = (rowsOnScreen + 5) * ITEMS_PER_ROW;
     if (items.length > (start + itemsToShow)) {
     end = start + itemsToShow;
     const rowsToPad = Math.ceil((items.length - end) / ITEMS_PER_ROW);
     paddingBottom = rowsToPad * (ROW_HEIGHT + MARGIN_TOP);
     }

     return {
     end,
     paddingBottom,
     paddingTop,
     start,
     };
     }

     renderSongs(start, end) {
     const chunk = 5;
     const {
     auth,
     dispatch,
     tracks,
     track_info,
     users,
     playlist,
     scrollFunc
     } = this.props;
     const items = playlist.items;
     const result = [];

     for (let i = start; i < end; i += chunk) {
     const songCards = items.slice(i, i + chunk).map((songId, j) => {
     const info = track_info[songId];
     const from = users[info.user];

     const track = tracks[info.track];
     const scrollFunc = fetchSongsIfNeeded.bind(null, playlist);
     const user = users[track.user_id];
     const index = i + j;

     const playSong = function () {
     Console.log("play song")
     };

     const activeTrackId = null;

     return (
     <SongCard key={`${index}-${track.id}`}
     playSong={playSong}
     auth={auth}
     dispatch={dispatch}
     isPlaying={track.id === activeTrackId}
     scrollFunc={scrollFunc}
     track={track}
     user={user}
     />
     );
     });

     if (songCards.length < chunk) {
     for (let j = 0; j < chunk - songCards.length + 1; j++) {
     songCards.push(<div className="col-1-5" key={`song-placeholder-${(i + j)}`} />);
     }
     }

     result.push(
     <div className="songs-row row grid" key={`songs-row-${i}`}>
     {songCards}
     </div>
     );
     }

     return result;
     }

     render() {
     const { playlist, playlists } = this.props;
     const { end, paddingBottom, paddingTop, start } = this.state;
     const isFetching = playlist.isFetching;

     return (
     <div className="content">
     <div className="padder" style={{ height: paddingTop }} />
     {this.renderSongs(start, end)}
     <div className="padder" style={{ height: paddingBottom }} />
     {isFetching ? <Spinner /> : null}
     </div>
     );
     }*/

    render() {

        const {
            auth,
            dispatch,
            tracks,
            track_info,
            users,
            playlist,
            playlists,
            scrollFunc
        } = this.props;

        const p = playlists[playlist];


        const isFetching = p.isFetching;

        return (
            <div className="songs">
                <div className="row">
                    {

                        p.items.map((songId) => {

                            const info = track_info[songId];
                            const from = users[info.user];

                            const track = tracks[info.track];
                            const scrollFunc = fetchSongsIfNeeded.bind(null, playlist);
                            track.user = users[track.user_id];

                            const playSong = function () {
                                Console.log("play song")
                            };

                            const activeTrackId = null;

                            return (
                                <SongCard
                                    playSong={playSong}
                                    auth={auth}
                                    dispatch={dispatch}
                                    isPlaying={track.id === activeTrackId}
                                    scrollFunc={scrollFunc}

                                    track={track}
                                    from={from}
                                    info={info}
                                />
                            );
                        })
                    }
                </div>
                {isFetching ? <Spinner /> : null}
            </div>
        );
    }
}

SongCards.propTypes = {
    auth: PropTypes.object.isRequired,
    height: PropTypes.number,
    tracks: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    track_info: PropTypes.object.isRequired,
    users: PropTypes.object.isRequired,
    playlist: PropTypes.string.isRequired,
    playlists: PropTypes.object.isRequired,
    scrollFunc: PropTypes.func.isRequired
};
export default infiniteScroll(SongCards);