// @flow
import React, {Component} from "react";
import {close, maximize, minimize} from "../../actions/windowActions";


class Header extends Component {
  render() {
    return (
      <nav className="navbar navbar-dark navbar-fixed-top">
        <div className="flex flex-items-xs-between">
          <a className="navbar-brand" href="#">Soundtop</a>
          <ul className="nav window-controls flex">

            <a className="control control-minimize" onClick={minimize} href="javascript:void(0)">
              <i className="material-icons">remove</i>
            </a>
            <a className="control control-maximize" onClick={maximize} href="javascript:void(0)">
              <i className="material-icons">fullscreen</i>
            </a>
            <a className="control control-close" onClick={close} href="javascript:void(0)">
              <i className="material-icons">close</i>
            </a>
          </ul>
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
