import React, {Component} from "react";
import {connect} from "react-redux";
import cn from "classnames";
import {TabContent, TabPane, Row, Col, Container} from "reactstrap";

import {fetchTrackIfNeeded, playTrack, toggleLike, fetchMore} from "../actions";
import {getImageUrl, formatDescription, isLiked} from "../utils/soundcloudUtils";
import {abbreviate_number, getPlayingTrackId, getCurrentPlaylist} from "../utils/";

import {IMAGE_SIZES} from "../constants/Soundcloud";
import {RELATED_PLAYLIST, STATUS} from "../constants/playlist";
import {OBJECT_TYPES} from "../constants/global";

import Spinner from "../components/spinnerComponent";
import TogglePlay from "../components/togglePlay";
import TrackListComponent from "../components/trackList/trackListComponent";
import UserCard from "../components/userCardComponent";
import CommentList from "../components/commentListComponent";
import InfinityScroll from "../components/infinityScrollComponent";
import FallbackImage from "../components/FallbackImageComponent";

import "../assets/css/songDetails/songDetails.scss"


class songContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            activeTab: '1'
        };

        this.toggle = this.toggle.bind(this);
        this.hasDescription = this.hasDescription.bind(this);
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

    componentDidMount() {
        const {params} = this.props;
        if (!this.hasDescription(params.songId)) {
            this.toggle('2');
        }
    }

    componentWillReceiveProps(nextProps) {
        const {dispatch, params} = this.props;
        if (params.songId != nextProps.params.songId) {
            dispatch(fetchTrackIfNeeded(nextProps.params.songId));
            this.setState({
                activeTab: this.hasDescription(nextProps.params.songId) ? "1" : "2"
            })
        }
    }

    hasDescription(songId) {
        const {track_entities} = this.props;

        const track = track_entities[songId];
        return track.description.length > 0;

    }


    playTrack(i, e) {
        e.preventDefault();
        const {dispatch, params} = this.props;
        const current_playlist = params.songId + RELATED_PLAYLIST;
        dispatch(playTrack(i, current_playlist));
    }

    renderToggleButton() {
        const {params, playingSongId} = this.props;

        if (playingSongId != null && (playingSongId == params.songId)) {
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

    fetchMore() {
        const {params, dispatch} = this.props;

        if (this.state.activeTab == "3") {
            dispatch(fetchMore(params.songId, OBJECT_TYPES.COMMENTS));
        }

    }

    render() {
        const {
            track_entities,
            params,
            user_entities,
            likes,
            playlists,
            player,
            dispatch,
            followings,
            comments,
            comment_entities,
            app
        } = this.props;

        const {songId} = params;

        const track = track_entities[songId];

        if (!track) {
            return <Spinner />
        }
        const playlist = songId + RELATED_PLAYLIST;

        const user = user_entities[track.user_id];

        const img_url = getImageUrl(track, IMAGE_SIZES.LARGE);

        const likeFunc = this.toggleLike.bind(this, track.id);
        const liked = isLiked(track.id, likes);

        const playlist_playing = this.isCurrentPlaylist();

        const hasDesc = track.description.length > 0;
        const track_comments = comments[songId] || {};

        return (
            <InfinityScroll
                playing={player.currentSong != null}
                scrollFunc={this.fetchMore.bind(this)}>
                <div className="trackDetails">
                    <Container fluid={true}>
                        <Row className="trackHeader">

                            <div className="overlayWrapper">
                                <FallbackImage
                                    offline={app.offline}
                                    dispatch={dispatch}
                                    track_id={track.id}
                                    className="overlayImg"
                                    src={img_url}/>
                            </div>

                            <Col xs="12" md="4" xl="2">
                                <div className="imageWrapper">
                                    <FallbackImage
                                        offline={app.offline}
                                        dispatch={dispatch}
                                        track_id={track.id}
                                        src={img_url}/>

                                    <FallbackImage
                                        offline={app.offline}
                                        dispatch={dispatch}
                                        track_id={track.id}
                                        className="imgShadow"
                                        src={img_url}/>

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
                                            <i className="icon-retweet"/>
                                            <span>{abbreviate_number(track.reposts_count)}</span>
                                        </div>
                                    </div>
                                </div>
                            </Col>

                            <Col xs="12" md="8" xl="" className="trackInfo text-md-left text-xs-center">
                                <h1 className="trackTitle">{track.title}</h1>
                                <h2 className="trackArtist">{user.username}</h2>

                                <div className="flex trackActions flex-wrap flex-items-xs-center flex-items-md-left">
                                    {
                                        this.renderToggleButton()
                                    }
                                    <a href="javascript:void(0)" className={cn("c_btn", {liked: liked})}
                                       onClick={likeFunc}>
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
                                    {
                                        hasDesc ?
                                            <a href="javascript:void(0)"
                                               className={cn({active: this.state.activeTab === '1'})} onClick={() => {
                                                this.toggle('1');
                                            }}>
                                                Info
                                            </a> : null
                                    }

                                    <a href="javascript:void(0)"
                                       className={cn({active: this.state.activeTab === '2', playing: playlist_playing})}
                                       onClick={() => {
                                           this.toggle('2');
                                       }}>
                                        Related tracks
                                        { playlist_playing ? <span className="icon-volume_up up blink"></span> : null}

                                    </a>
                                    <a href="javascript:void(0)" className={cn({active: this.state.activeTab === '3'})}
                                       onClick={() => {
                                           this.toggle('3');
                                       }}>
                                        <span className="text">Comments</span>
                                        <span className="tag tag-pill tag-default">{track.comment_count}</span>
                                    </a>
                                </div>

                                <Container fluid>
                                    <Row>
                                        <Col xs="12" className="col-lg user_card_wrap trackMain">
                                            <UserCard
                                                user={user}
                                                dispatch={dispatch}
                                                followings={followings}
                                                offline={app.offline}/>
                                        </Col>
                                        <Col xs="12" className="trackMain col-lg">

                                            <TabContent activeTab={this.state.activeTab}>
                                                {
                                                    hasDesc ? <TabPane tabId="1">
                                                        <div
                                                            className={cn("trackDescription", {isOpen: this.state.open})}>
                                                            <div
                                                                className={cn("descriptionInner", {cut: this.state.cut})}
                                                                ref="descr"
                                                                dangerouslySetInnerHTML={formatDescription(track.description)}></div>
                                                        </div>
                                                    </TabPane> : null
                                                }
                                                <TabPane tabId="2">
                                                    <TrackListComponent
                                                        player={player}
                                                        playlist={playlist}
                                                        playlists={playlists}
                                                        track_entities={track_entities}
                                                        dispatch={dispatch}
                                                        user_entities={user_entities}
                                                        likes={likes}
                                                        likeFunc={this.toggleLike.bind(this)}/>
                                                </TabPane>
                                                <TabPane tabId="3">
                                                    <CommentList
                                                        comments={track_comments}
                                                        user_entities={user_entities}
                                                        comment_entities={comment_entities}/>
                                                </TabPane>
                                            </TabContent>

                                        </Col>
                                    </Row>
                                </Container>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </InfinityScroll>
        );
    }
}

function mapStateToProps(state) {
    const {entities, player, objects, auth, app} = state;
    const {track_entities, user_entities, comment_entities} = entities;
    const {likes, followings} = auth;
    const playlists = objects[OBJECT_TYPES.PLAYLISTS] || {};
    const comment_objects = objects[OBJECT_TYPES.COMMENTS] || {};
    const playingSongId = getPlayingTrackId(player, playlists);

    return {
        track_entities,
        user_entities,
        player,
        playingSongId,
        likes,
        playlists,
        followings,
        comments: comment_objects,
        comment_entities,
        app
    }
}

export default connect(mapStateToProps)(songContainer);
