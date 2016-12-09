import React, {Component} from "react"
import ReactDOM from "react-dom"
import {connect} from "react-redux";
import {Row, Container, Col, TabContent, TabPane} from "reactstrap"
import cn from "classnames"

import {fetchMore, toggleLike, toggleFollowing} from "../_shared/actions/"
import {fetchArtistIfNeeded} from "../_shared/actions/artistActions"
import {getImageUrl, isFollowing, formatDescription} from "../_shared/utils/soundcloudUtils"
import {abbreviate_number} from "../_shared/utils"
import {IMAGE_SIZES} from "../_shared/constants/Soundcloud"
import TrackList from "../songDetailsPage/components/trackListComponent"
import Trackgrid from "../streamPage/components/TracksGrid/TracksGrid"
import {USER_TRACKS_PLAYLIST} from "../_shared/constants/playlist"
import {OBJECT_TYPES} from "../_shared/constants/global"
import InfinityScroll from "../_shared/components/infinityScrollComponent"
import Spinner from "../_shared/components/spinnerComponent"
import FallbackImage from "../_shared/components/FallbackImageComponent"
import ToggleMoreComponent from "../_shared/components/toggleMoreComponent"


class artistContainer extends Component {

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
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
        const {dispatch, params} = this.props;
        const {artistId} = params;
        dispatch(fetchArtistIfNeeded(artistId));
    }

    toggleLike(trackID, e) {
        e.preventDefault();
        const {dispatch} = this.props;

        dispatch(toggleLike(trackID));
    }

    toggleFollow() {
        const {dispatch, auth,params} = this.props;
        const {artistId} = params;

        dispatch(toggleFollowing(artistId));
    }

    render() {
        const {entities, params, auth, player, playlists, app, dispatch} = this.props;
        const {user_entities, track_entities} = entities;
        const {followings, likes} = auth;
        const {artistId} = params;

        const user = user_entities[artistId];

        if (!user || !user.track_count) return (
            <Spinner />
        );

        const user_img = getImageUrl(user.avatar_url, IMAGE_SIZES.LARGE);
        const following = isFollowing(user.id, followings);
        const playlist_name = artistId + USER_TRACKS_PLAYLIST;

        const playlist = playlists[playlist_name] || {};

        return (
            <InfinityScroll
                playing={false}
                scrollFunc={fetchMore.bind(this, playlist_name, OBJECT_TYPES.PLAYLISTS)}
                dispatch={dispatch}
                className="artistPage">
                <Container fluid={true} className="artist trackDetails">
                    <Row className="trackHeader">

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
                </Container>
                <div className="flex tracktabs">
                    <a href="javascript:void(0)" className={cn({active: this.state.activeTab === '1'})}
                       onClick={() => {
                           this.toggle('1');
                       }}>
                        <span className="text">Tracks</span>
                    </a>
                </div>
                <Container fluid>
                    <Row>
                        <Col xs="9">

                            <TabContent activeTab={this.state.activeTab}>
                                <TabPane tabId="1">
                                    <TrackList
                                        dispatch={dispatch}
                                        likes={likes}
                                        player={player}
                                        user_entities={user_entities}
                                        track_entities={track_entities}
                                        playlist={playlist_name}
                                        playlists={playlists}
                                        likeFunc={this.toggleLike.bind(this)}

                                    />

                                    {playlist.isFetching ? <Spinner/> : null}

                                </TabPane>
                            </TabContent>

                        </Col>
                        <Col xs="3" className="artistSide">
                            <ToggleMoreComponent>
                                <div dangerouslySetInnerHTML={formatDescription(user.description)}></div>
                            </ToggleMoreComponent>

                        </Col>
                    </Row>
                </Container>
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