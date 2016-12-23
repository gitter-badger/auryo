import React, {Component, PropTypes} from "react"

import {PROFILE_SERVICES} from "../constants"

import "../assets/css/common/artistProfiles.scss"

class ArtistProfiles extends Component {

    static getIcon(service) {

        switch (service){
            case PROFILE_SERVICES.PERSONAL:
                return "globe";
            default:
                if (PROFILE_SERVICES[service.toUpperCase()] != null) {
                    return service
                }
                return "globe";
        }




    }

    static getTitle(title) {
        switch (title.toLowerCase()) {
            case "spotify":
                return "spotify";
            case "youtube":
                return "youtube";
            case "pinterest":
                return "pinterest";
            case "snapchat":
                return "snapchat";
            default:
                return null;

        }
    }

    render() {
        const {profiles} = this.props;

        if (!profiles || !profiles.length) return null;

        return (
            <div id="web-profiles">
                {
                    profiles.map(function (profile) {

                        const title = ArtistProfiles.getTitle(profile.title);
                        if (profile.service == "personal" && title) {
                            profile.service = title;
                        }

                        const icon = "icon-" + ArtistProfiles.getIcon(profile.service);

                        return (
                            <a href={profile.url} className={"profile " + profile.service.toLowerCase()}
                               key={profile.id}>
                                <i className={icon}/>
                                <span>{profile.title ? profile.title : profile.service}</span>
                            </a>
                        )
                    })
                }
            </div>
        )
    }
}

ArtistProfiles.propTypes = {
    profiles: PropTypes.array
};

export default ArtistProfiles;