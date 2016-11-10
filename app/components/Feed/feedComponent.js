import React, {Component, PropTypes} from "react";
import TracksGrid from "../../components/TracksGrid/TracksGrid";
import {fetchMore} from "../../actions/";

class Feed extends Component {

  componentWillMount() {
    const {dispatch, playlist, playlists} = this.props;
    if (!(playlist in playlists) || playlists[playlist].items.length === 0) {
      dispatch(fetchMore(playlist));
    }
  }

  componentWillReceiveProps(nextProps) {
    const {dispatch, playlist, playlists} = this.props;
    if (playlist !== nextProps.playlist) {
      if (!(nextProps.playlist in playlists) || playlists[nextProps.playlist].items.length === 0) {
        dispatch(fetchMore(nextProps.playlist));
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
  user: PropTypes.object.isRequired,
  feedInfo: PropTypes.object.isRequired,
  tracks: PropTypes.object.isRequired,
  playingSongId: PropTypes.string,
  users: PropTypes.object.isRequired,
  current_playlist: PropTypes.string.isRequired,
  playlists: PropTypes.object.isRequired,
  scrollFunc: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired
};

export default Feed;
