import React, {Component, PropTypes} from "react";
import {IndexLink} from "react-router"

import User from "./User/userComponent";

import "../../../../assets/css/common/sidebar.scss"

class SideBar extends Component {
    render() {
        const {me} = this.props;
        return (
            <aside className="sidebar-offcanvas" id="sidebar" role="navigation">
                <User me={me}/>

                <div id="sidebar-menu">
                    <h2>Discover</h2>
                    <ul className="nav">
                        <li className="navItem">
                            <IndexLink to="/" className="navLink" activeClassName="active">
                                <i className="icon-audiotrack"/>
                                <span>Stream</span>
                            </IndexLink>
                        </li>
                        {/*
                         <li className="navItem">
                         <Link to="/chart" className="navLink" activeClassName="active">
                         <i className="icon-poll" />
                         <span>Charts</span></Link>
                         </li>
                         */}
                    </ul>
                    {/*
                     <h2>Me</h2>
                     <ul className="nav">
                     <li className="navItem">
                     <Link to="/likes" className="navLink" activeClassName="active">
                     <i className="icon-favorite" />
                     <span>Likes</span></Link>
                     </li>
                     <li className="navItem">
                     <Link to="/playlists" className="navLink" activeClassName="active">
                     <i className="icon-album" />
                     <span>Playlists</span></Link>
                     </li>
                     </ul>
                     */}
                </div>
            </aside>
        );
    }
}

SideBar.propTypes = {
    me: PropTypes.object.isRequired
};

export default SideBar;
