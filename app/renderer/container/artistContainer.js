import React, {Component} from "react"
import ReactDOM from "react-dom"
import {connect} from "react-redux";
import {Row, Container, Col, TabContent, TabPane} from "reactstrap"
import cn from "classnames"

import {fetchMore, toggleLike, toggleFollowing, fetchArtistIfNeeded} from "../actions/"
import {SC, abbreviate_number, getPlayingTrackId} from "../utils"
import {IMAGE_SIZES, USER_TRACKS_PLAYLIST_SUFFIX, USER_LIKES_SUFFIX, OBJECT_TYPES} from "../constants"

import TrackList from "../components/trackList/trackListComponent"
import InfinityScroll from "../components/infinityScrollComponent"
import Spinner from "../components/spinnerComponent"
import FallbackImage from "../components/FallbackImageComponent"
import ToggleMoreComponent from "../components/toggleMoreComponent"

import "../assets/css/Artist/artistpage.scss"

class artistContainer extends Component {

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.renderPlaylist = this.renderPlaylist.bind(this);

        this.state = {
            activeTab: '1'
        };
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    componentWillMount() {
        const {dispatch, params:{artistId}} = this.props;

        dispatch(fetchArtistIfNeeded(artistId));
    }

    toggleLike(trackID, e) {
        const {dispatch} = this.props;

        e.preventDefault();
        dispatch(toggleLike(trackID));
    }

    toggleFollow() {
        const {dispatch, params:{artistId}} = this.props;

        dispatch(toggleFollowing(artistId));
    }

    renderPlaylist(playlist_name) {
        const {playlists, auth, player, entities, params, dispatch} = this.props;
        const {artistId} = params;
        const {likes} = auth;
        const {user_entities, track_entities} = entities;

        playlist_name = artistId + playlist_name;
        const playlist = playlists[playlist_name] || {};

        return (
            <div>
                <TrackList
                    dispatch={dispatch}
                    likes={likes}
                    player={player}
                    user_entities={user_entities}
                    track_entities={track_entities}
                    playlist_name={playlist_name}
                    playlist={playlist}
                    playingTrackId={getPlayingTrackId(player, playlists)}
                    likeFunc={this.toggleLike.bind(this)}

                />
                {playlist.isFetching ? <Spinner/> : null}
            </div>

        )
    }

    render() {
        const {entities, params:{artistId}, auth, player, playlists, app, dispatch, playingTrackId} = this.props;
        const {user_entities, track_entities} = entities;
        const {followings, likes} = auth;

        const user = user_entities[artistId];

        if (!user || !user.track_count) return (
            <Spinner />
        );

        const user_img = SC.getImageUrl(user.avatar_url, IMAGE_SIZES.LARGE);
        const following = SC.isFollowing(user.id, followings);
        const playlist_name = artistId + USER_TRACKS_PLAYLIST_SUFFIX;


        return (
            <InfinityScroll
                playing={player.currentSong != null}
                scrollFunc={fetchMore.bind(this, playlist_name, OBJECT_TYPES.PLAYLISTS)}
                dispatch={dispatch}
                className="artistPage container-fluid">
                <Row className="trackHeader row">

                    <div className="overlayWrapper">
                        <FallbackImage
                            offline={app.offline}
                            dispatch={dispatch}
                            track_id={user.id}
                            className="overlayImg"
                            src={user_img}/>
                    </div>

                    <Col xs="12" md="4" xl="2">
                        <div className="imageWrapper">
                            <FallbackImage
                                offline={app.offline}
                                dispatch={dispatch}
                                track_id={user.id}
                                src={user_img}/>

                            <FallbackImage
                                offline={app.offline}
                                dispatch={dispatch}
                                track_id={user.id}
                                className="imgShadow"
                                src={user_img}/>
                        </div>
                    </Col>

                    <Col xs="12" md="8" xl="10" className="trackInfo text-md-left text-xs-center">

                        <Row className="flex-items-md-between">
                            <Col xs="12" md="6">
                                <h1 className="trackTitle">{user.username}</h1>
                                <h2 className="trackArtist">{user.city}{user.city && user.country ? " , " : null }{user.country}</h2>
                            </Col>

                            <Col xs="12" md="" className="col-md text-xs-right">
                                <ul className="artistStats flex flex-items-xs-center flex-items-md-right">
                                    <li>
                                        <span>{abbreviate_number(user.followers_count)}</span>
                                        <span>Followers</span>
                                    </li>
                                    <li>
                                        <span>{abbreviate_number(user.followings_count)}</span>
                                        <span>Following</span>
                                    </li>
                                    <li>
                                        <span>{abbreviate_number(user.track_count)}</span>
                                        <span>Tracks</span>
                                    </li>
                                </ul>
                                <a href="javascript:void(0)"
                                   className={cn("c_btn", {following: following})}
                                   onClick={this.toggleFollow.bind(this)}>
                                    {following ? <i className="icon-check"></i> : <i className="icon-add"></i>}
                                    <span>{following ? "Following" : "Follow"}</span>
                                </a>
                            </Col>
                        </Row>

                    </Col>

                </Row>
                <div className="flex tracktabs row">
                    <a href="javascript:void(0)" className={cn({active: this.state.activeTab === '1'})}
                       onClick={() => {
                           this.toggle('1');
                       }}>
                        <span className="text">Tracks</span>
                    </a>
                    <a href="javascript:void(0)" className={cn({active: this.state.activeTab === '2'})}
                       onClick={() => {
                           this.toggle('2');
                       }}>
                        <span className="text">Likes</span>
                    </a>
                </div>
                <Row>
                    <Col xs="9">

                        <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId="1">

                                {this.renderPlaylist(USER_TRACKS_PLAYLIST_SUFFIX)}

                            </TabPane>
                            <TabPane tabId="2">
                                {this.renderPlaylist(USER_LIKES_SUFFIX)}

                            </TabPane>
                        </TabContent>

                    </Col>
                    <Col xs="3" className="artistSide">
                        <ToggleMoreComponent>
                            <div dangerouslySetInnerHTML={SC.formatDescription(user.description)}></div>
                        </ToggleMoreComponent>

                    </Col>
                </Row>
            </InfinityScroll>
        )
    }
}
function mapStateToProps(state) {
    const {entities, auth, app, player, objects} = state;

    const playlists = objects[OBJECT_TYPES.PLAYLISTS] || {};

    return {
        entities,
        app,
        auth,
        player,
        playlists
    }
}

export default connect(mapStateToProps)(artistContainer);