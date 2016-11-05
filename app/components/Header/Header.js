// @flow
import React, {Component} from 'react';
import {Link} from 'react-router';


class Header extends Component {
    render() {
        return (
            <nav className="navbar navbar-dark navbar-fixed-top">
                <button className="navbar-toggler hidden-sm-up pull-right" type="button" data-toggle="collapse" data-target="#collapsingNavbar">
                    ☰
                </button>
                <a className="navbar-brand" href="#">Soundtop</a>
                <div className="collapse navbar-toggleable-xs" id="collapsingNavbar">
                </div>
            </nav>
        );
    }
}

export default Header;

/*<ul className="nav navbar-nav pull-right">
 <li className="nav-item active">
 <a className="nav-link" href="#">Home <span class="sr-only">Home</span></a>
 </li>
 <li className="nav-item">
 <a className="nav-link" href="#features">Features</a>
 </li>
 <li className="nav-item">
 <a className="nav-link" href="#myAlert" data-toggle="collapse">Wow</a>
 </li>
 <li className="nav-item">
 <a className="nav-link" href="" data-target="#myModal" data-toggle="modal">About</a>
 </li>
 </ul>*/