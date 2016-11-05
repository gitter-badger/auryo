import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {CLIENT_ID} from '../../constants/Config';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../../actions';
import SongCard from '../../components/SongCard';

class Feed extends Component {

    render() {

        const {publisher_metadata, track, track_info, users, trackIds, activeTrackId, playSong} = this.props;

        return (
            <div className="row">
                {
                    trackIds.map((key) => {

                        const info = track_info[key];
                        const t = track[info.track];
                        info.from = users[info.user];
                        const publisher = publisher_metadata[t.urn];

                        t.t_info = info;
                        t.user = users[t.user_id];
                        t.publisher_metadata = publisher;

                        const playing = ((activeTrackId != null) && (activeTrackId.id == t.id));
                        return (
                            <SongCard key={key} track={t} isPlaying={playing}
                                      playSong={playSong}/>
                        );
                    })
                }
            </div>
        );
    }
}

Feed.propTypes = {
    publisher_metadata: PropTypes.object,
    track: PropTypes.object,
    track_info: PropTypes.object,
    users: PropTypes.object,
    trackIds: PropTypes.array,
    activeTrack: PropTypes.object,
    onPlay: PropTypes.func
};

function mapStateToProps(state) {
    const {trackEntities, trackIds, activeTrackId} = state.track;
    const publisher_metadata = trackEntities.publisher_metadata;
    const track = trackEntities.track;
    const track_info = trackEntities.track_info;
    const users = trackEntities.users;
    return {
        publisher_metadata, track, track_info, users,
        trackIds,
        activeTrackId
    }
}
function mapDispatchToProps(dispatch) {
    return {
        playSong: bindActionCreators(actions.playTrack, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Feed);