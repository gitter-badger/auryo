import React, {Component, PropTypes} from "react";
import cn from "classnames";

import {getImageUrl, isFollowing} from "../utils/soundcloudUtils";
import {toggleFollowing} from "../actions";

import {IMAGE_SIZES} from "../constants/Soundcloud";

import FallbackImage from "./FallbackImageComponent";
import "../../assets/css/common/user_card.scss"

export default class UserCard extends Component {
    constructor(props) {
        super(props);
    }

    toggleFollow() {
        const {dispatch, user} = this.props;

        dispatch(toggleFollowing(user.id));
    }

    render() {
        const {user, followings,offline} = this.props;


        const following = isFollowing(user.id, followings);
        const followFunc = this.toggleFollow.bind(this);

        return (
            <div className="user_card">
                <div className="user_img">
                    <FallbackImage
                        src={getImageUrl(user.avatar_url, IMAGE_SIZES.MEDIUM)}
                        track_id={user.id}
                        offline={offline}
                    />
                </div>
                <div className="user_info">
                    <div className="user_username">
                        {user.username}
                    </div>
                    <a href="javascript:void(0)" className={cn("c_btn outline", {following: following})}
                       onClick={followFunc}>
                        {following ? <i className="icon-check"></i> : <i className="icon-add"></i>}
                        <span>{following ? "Following" : "Follow"}</span>
                    </a>
                </div>
            </div>
        )
    }
}

UserCard.propTypes = {
    dispatch: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    followings: PropTypes.object.isRequired,
    offline: PropTypes.bool.isRequired
};

