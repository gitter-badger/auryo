// @flow
import React, {Component, PropTypes} from 'react';
import cn from 'classnames';
import './user.global.css';

import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem,Button} from 'reactstrap';


class User extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);

        this.state = {
            dropdownOpen: false
        };
    }

    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    Logout(){
        console.log("Logout");
    }

    render() {
        const {user} = this.props;

        return (
            <div className="user">
                <Dropdown className="dropdown" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                    <DropdownToggle tag="a" className="btn-link">
                        <i className="icon-chevron-thin-down"/>
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-menu-right">
                        <DropdownItem onClick={this.Logout}>Logout</DropdownItem>
                    </DropdownMenu>
                </Dropdown>

                <div className="flex">
                    <div className="userImage">
                        <img src={user.avatar_url}/>
                    </div>
                    <div className="userName">
                        {user.username}
                    </div>
                </div>
            </div>
        );
    }
}

User.propTypes = {
    user: PropTypes.object.isRequired
};

export default User;
