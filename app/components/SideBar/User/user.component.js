// @flow
import React, {Component, PropTypes} from 'react';
import cn from 'classnames';
import './user.global.css';
import {logout} from '../../../actions';

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

    render() {
        const {me} = this.props;

        return (
            <div className="user">
                <Dropdown className="dropdown" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                    <DropdownToggle tag="a" className="btn-link">
                        <i className="icon-chevron-thin-down"/>
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-menu-right">
                        <DropdownItem onClick={logout}>Logout</DropdownItem>
                    </DropdownMenu>
                </Dropdown>

                <div className="flex">
                    <div className="userImage">
                        <img src={me.avatar_url}/>
                    </div>
                    <div className="userName">
                        {me.username}
                    </div>
                </div>
            </div>
        );
    }
}

User.propTypes = {
  me: PropTypes.object.isRequired
};

export default User;
