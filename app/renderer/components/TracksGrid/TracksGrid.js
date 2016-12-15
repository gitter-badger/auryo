import React, {Component, PropTypes} from "react";
import TrackGridItem from "./TrackGridItem";
import {fetchMore, playTrack} from "../../actions";
import Spinner from "../spinnerComponent";
import ReactList from "react-list";

class TracksGrid extends Component {
    constructor(props) {
        super(props);

        this.renderItem = this.renderItem.bind(this);
    }

    playTrack(i, e) {
        const {current_playlist, dispatch} = this.props;

        e.preventDefault();
        dispatch(playTrack(i, current_playlist));
    }

    renderItem(index, key) {

        const {
            auth,
            feedInfo_entities,
            track_entities,
            playingSongId,
            user_entities,
            current_playlist,
            playlists,
            dispatch,
            app
        } = this.props;

        const items = current_playlist in playlists ? playlists[current_playlist].items : [];
        const scrollFunc = fetchMore.bind(null, current_playlist);

        const id = items[index];
        const info = feedInfo_entities[id];
        const track = track_entities[id];
        track.user = user_entities[track.user_id];
        track.from_user = user_entities[info.from_user];
        track.activity_type = info.activity_type;

        const playTrackFunc = this.playTrack.bind(this, index);

        return (

            <TrackGridItem key={key}
                           playTrackFunc={playTrackFunc}
                           auth={auth}
                           dispatch={dispatch}
                           isPlaying={track.id === playingSongId}
                           scrollFunc={scrollFunc}
                           app={app}
                           track={track}/>

        );
    }

    renderWrapper(items, ref) {
        return <div className="row" ref={ref}>{items}</div>
    }

    render() {

        const {
            current_playlist,
            playlists
        } = this.props;

        const items = current_playlist in playlists ? playlists[current_playlist].items : [];
        const playlist = playlists[current_playlist] || {};
        const isFetching = playlist.isFetching;

        return (
            <div className="songs">
                <ReactList
                    type="simple"
                    length={items.length}
                    itemsRenderer={this.renderWrapper}
                    itemRenderer={this.renderItem}
                    threshold={150}
                    useTranslate3d={true}
                />
                {isFetching ? <Spinner /> : null}
            </div>
        );
    }
}

TracksGrid.propTypes = {
    feedInfo_entities: PropTypes.object.isRequired,
    track_entities: PropTypes.object.isRequired,
    user_entities: PropTypes.object.isRequired,

    auth: PropTypes.object.isRequired,
    app: PropTypes.object.isRequired,
    playingSongId: PropTypes.number,
    current_playlist: PropTypes.string.isRequired,
    playlists: PropTypes.object.isRequired,
    scrollFunc: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired
};
export default TracksGrid;
