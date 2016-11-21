import React, {Component} from "react";
import {connect} from "react-redux";
import {fetchTrackIfNeeded, playTrack, toggleLike} from "../_common/actions";
import Spinner from "../_common/components/Spinner/index";
import {IMAGE_SIZES} from "../_common/constants/Soundcloud";
import {getImageUrl, formatDescription, isLiked} from "../_common/utils/soundcloudUtils";
import {getPlayingTrackId, getCurrentPlaylist} from "../_Player/playerUtils";
import {abbreviate_number} from "../_common/utils/appUtils";
import TogglePlay from "../_common/components/togglePlay";
import cn from "classnames";
import {RELATED_PLAYLIST, STATUS} from "../_common/constants/playlist";
import TrackListComponent from "./components/trackListComponent";
import {TabContent, TabPane, Row, Col, Container} from "reactstrap";
import UserCard from "../_common/components/User/UserCard";


class songContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      activeTab: '1'
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  componentWillMount() {
    const {dispatch, params} = this.props;
    dispatch(fetchTrackIfNeeded(params.songId));
  }

  componentWillReceiveProps(nextProps) {
    const {dispatch, params} = this.props;
    if (params.songId != nextProps.params.songId) {
      dispatch(fetchTrackIfNeeded(nextProps.params.songId));
    }
  }


  playTrack(i, e) {
    e.preventDefault();
    const {dispatch, params} = this.props;
    const current_playlist = params.songId + RELATED_PLAYLIST;
    dispatch(playTrack(i, current_playlist));
  }

  renderToggleButton() {
    const {params, playingSongId} = this.props;

    if (playingSongId == params.songId) {
      return <TogglePlay classname="playButton"/>;
    }

    const playTrackFunc = this.playTrack.bind(this, 0);

    const icon = (playingSongId == params.songId) ? 'pause' : 'play_arrow';

    return (

      <a className="playButton" onClick={playTrackFunc}>
        <i className={`icon-${icon}`}/>
      </a>
    );
  }

  toggleLike(trackID, e) {
    e.preventDefault();
    const {dispatch} = this.props;

    dispatch(toggleLike(trackID));
  }


  isCurrentPlaylist() {
    const {params, player} = this.props;
    const current_playlist = params.songId + RELATED_PLAYLIST;

    return getCurrentPlaylist(player) == current_playlist && (player.status == STATUS.PLAYING);

  }

  render() {
    const {tracks, params, users, likes, playlists, player, dispatch, followings} = this.props;

    const track = tracks[params.songId];

    if (!track) {
      return <Spinner />
    }
    const playlist = params.songId + RELATED_PLAYLIST;

    const user = users[track.user_id];

    const img_url = getImageUrl(track, IMAGE_SIZES.LARGE);

    const likeFunc = this.toggleLike.bind(this, track.id);
    const liked = isLiked(track.id, likes);

    const playlist_playing = this.isCurrentPlaylist();

    return (
      <div className={cn("scroll trackDetails", {playing: player.currentSong != null})}>
        <Container fluid={true}>
          <Row className="trackHeader">

            <div className="overlayWrapper">
              <img className="overlayImg" src={img_url}/>
            </div>

            <Col xs="12" md="4" xl="2">
              <div className="imageWrapper">
                <img src={img_url}/>
                <img className="imgShadow" src={img_url}/>
                <div className="row flex-items-xs-center trackStats">
                  <div className="stat col-xs">
                    <i className="icon-favorite_border"/>
                    <span>{abbreviate_number(track.favoritings_count)}</span>
                  </div>
                  <div className="stat col-xs">
                    <i className="icon-play_arrow"/>
                    <span>{abbreviate_number(track.playback_count)}</span>
                  </div>
                  <div className="stat col-xs">
                    <i className="icon-chat_bubble"/>
                    <span>{abbreviate_number(track.comment_count)}</span>
                  </div>
                </div>
              </div>
            </Col>

            <Col xs="12" md="8" xl="" className="trackInfo text-md-left text-sm-center">
              <h1 className="trackTitle">{track.title}</h1>
              <h2 className="trackArtist">{user.username}</h2>

              <div className="flex trackActions flex-wrap flex-items-xs-center flex-items-md-left">
                {
                  this.renderToggleButton()
                }
                <a href="javascript:void(0)" className={cn("c_btn", {liked: liked})} onClick={likeFunc}>
                  <i className={liked ? "icon-favorite" : "icon-favorite_border"}/>
                  <span>Like</span>
                </a>
                {/*<a href="javascript:void(0)" className="c_btn">
                 <i className="icon-retweet"/>
                 <span>Repost</span>
                 </a>
                 <a href="javascript:void(0)" className="c_btn">
                 <i className="icon-add"/>
                 <span>Add to playlist</span>
                 </a>*/
                }
              </div>
            </Col>

          </Row>
          <Row>
            <Col xs="12" className="p-a-0">
              <div className="flex tracktabs">
                <a href="javascript:void(0)" className={cn({active: this.state.activeTab === '1'})} onClick={() => {
                  this.toggle('1');
                }}>
                  Info
                </a>
                <a href="javascript:void(0)"
                   className={cn({active: this.state.activeTab === '2', playing: playlist_playing})} onClick={() => {
                  this.toggle('2');
                }}>
                  Related tracks
                  { playlist_playing ? <span className="icon-volume_up"></span> : null}

                </a>
                {/*<a href="javascript:void(0)" className={cn({active: this.state.activeTab === '3'})} onClick={() => {
                 this.toggle('3');
                 }}>
                 Comments
                 </a>*/}
              </div>
              <TabContent activeTab={this.state.activeTab}>
                <TabPane tabId="1">
                  <Container fluid>
                    <Row>
                      <Col xs="12" className="col-md user_card_wrap trackMain">
                        <UserCard user={user} dispatch={dispatch} followings={followings}/>
                      </Col>
                      <Col xs="12" md="7" className="trackMain">
                        <div className={cn("trackDescription", {isOpen: this.state.open})}>
                          <div className={cn("descriptionInner", {cut: this.state.cut})} ref="descr"
                               dangerouslySetInnerHTML={formatDescription(track.description)}></div>
                        </div>
                      </Col>
                    </Row>
                  </Container>
                </TabPane>
                <TabPane tabId="2" className="trackMain">
                  <TrackListComponent
                    player={player}
                    playlist={playlist}
                    playlists={playlists}
                    tracks={tracks}
                    dispatch={dispatch}
                    users={users}
                    likes={likes}
                    likeFunc={this.toggleLike.bind(this)}/>
                </TabPane>
                <TabPane tabId="3">
                  Comments
                </TabPane>
              </TabContent>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const {entities, player, playlists, user} = state;
  const {tracks, users} = entities;
  const {likes, followings} = user;
  const playingSongId = getPlayingTrackId(player, playlists);
  return {
    tracks,
    users,
    player,
    playingSongId,
    likes,
    playlists,
    followings
  }
}

export default connect(mapStateToProps)(songContainer);
