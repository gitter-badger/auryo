import React, {Component} from "react";
import {connect} from "react-redux";
import {fetchTrackIfNeeded, playTrack, toggleLike} from "../_common/actions";
import Spinner from "../_common/components/Spinner/index";
import {IMAGE_SIZES} from "../_common/constants/Soundcloud";
import {getImageUrl, formatDescription, isLiked} from "../_common/utils/soundcloudUtils";
import {abbreviate_number} from "../_common/utils/appUtils";
import {getPlayingTrackId} from "../_Player/playerUtils";
import TogglePlay from "../_common/components/togglePlay";
import cn from "classnames";
import {RELATED_PLAYLIST} from "../_common/constants/playlist";
import TrackListComponent from "./components/trackListComponent";
import {Col, Row, Container} from "reactstrap";
import ReactDOM from "react-dom";
import {History} from 'react-router'

class songContainer extends Component {

  constructor(props) {
    super(props);

    this.toggleOpen = this.toggleOpen.bind(this);

    this.state = {
      open: false,
      cut: false
    };
    console.log(History);
  }

  componentWillMount() {
    const {dispatch, params} = this.props;
    dispatch(fetchTrackIfNeeded(params.songId));
  }

  componentDidMount() {/*
    const description = ReactDOM.findDOMNode(this.refs.descr);

    const box = description.getBoundingClientRect();

    if (box.height > 200) {
      this.setState({
        cut: true
      })
    }*/
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

    return (

      <a className="playButton" onClick={playTrackFunc}>
        <i className="icon-play_arrow"/>
      </a>
    );
  }

  toggleOpen() {
    this.setState({
      open: !this.state.open
    })
  }

  toggleLike(trackID, e) {
    e.preventDefault();
    const {dispatch} = this.props;

    dispatch(toggleLike(trackID));
  }

  render() {
    const {tracks, params, users, likes, playlists, player, dispatch} = this.props;

    const track = tracks[params.songId];

    if (!track) {
      return <Spinner />
    }
    const playlist = params.songId + RELATED_PLAYLIST;

    const user = users[track.user_id];
    track.user = user;

    const img_url = getImageUrl(track, IMAGE_SIZES.LARGE);

    const likeFunc = this.toggleLike.bind(this, track.id);
    const liked = isLiked(track.id,likes);

    return (
      <div className={cn("scroll trackDetails", {playing: player.currentSong != null})}>
        <Container fluid={true}>
          <Row className="trackHeader">

            <div className="overlayWrapper">
              <img className="overlayImg" src={img_url}/>
            </div>

            <Col xs="12" md="3">
              <div className="imageWrapper">
                <img src={img_url}/>
                <img className="imgShadow" src={img_url}/>
              </div>
            </Col>

            <Col xs="12" md="9" className="trackInfo">
              <div className="trackTitle">{track.title}</div>
              <div className="trackArtist">{user.username}</div>
            </Col>

          </Row>

          <Row>
            <Col xs="12" md="3">
              <div className="flex flex-items-xs-center trackStats">
                <div className="stat">
                  <i className="icon-favorite_border"/>
                  <span>{abbreviate_number(track.favoritings_count)}</span>
                </div>
                <div className="stat">
                  <i className="icon-play_arrow"/>
                  <span>{abbreviate_number(track.playback_count)}</span>
                </div>
                <div className="stat">
                  <i className="icon-chat_bubble"/>
                  <span>{abbreviate_number(track.comment_count)}</span>
                </div>
              </div>
            </Col>

            <Col xs="12" lg="9" className="trackInfoRight">
              <div className="flex trackActions">
                {
                  this.renderToggleButton()
                }
                <a className={cn("c_btn", {liked: liked})} onClick={likeFunc}>
                  <i className={liked ? "icon-favorite" : "icon-favorite_border"}/>
                  <span>Like</span>
                </a>
                <a className="c_btn">
                  <i className="icon-retweet"/>
                  <span>Repost</span>
                </a>
                <a className="c_btn">
                  <i className="icon-add"/>
                  <span>Add to playlist</span>
                </a>
              </div>

              <div className={cn("trackDescription", {isOpen: this.state.open})}>
                <div className={cn("descriptionInner",{cut:this.state.cut})} ref="descr"
                     dangerouslySetInnerHTML={formatDescription(track.description)}></div>
                {
                  (this.state.open) ? <a onClick={this.toggleOpen}>read less</a> :
                    <a onClick={this.toggleOpen}>read more</a>
                }
              </div>
            </Col>
          </Row>
          <Row  className="flex-items-lg-right">
            <Col xs="12" lg="9">


              <TrackListComponent
                player={player}
                playlist={playlist}
                playlists={playlists}
                tracks={tracks}
                dispatch={dispatch}
                users={users}
                likes={likes}
                likeFunc={this.toggleLike.bind(this)}/>
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
  const {likes} = user;
  const playingSongId = getPlayingTrackId(player, playlists);
  return {
    tracks,
    users,
    player,
    playingSongId,
    likes,
    playlists
  }
}

export default connect(mapStateToProps)(songContainer);
