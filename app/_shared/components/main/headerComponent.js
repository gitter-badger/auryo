import React, {Component} from "react";
import {close, maximize, minimize} from "../../actions/windowActions";
import HistoryTracker from "back-forward-history";


class Header extends Component {

    goBack() {
        if (HistoryTracker.canGoBack()) {
            HistoryTracker.browserHistory.goBack();
        }
    }

    goForward() {
        if (HistoryTracker.canGoForward()) {
            HistoryTracker.browserHistory.goForward();
        }
    }

    render() {
        return (
            <nav className="navbar navbar-dark navbar-fixed-top">
                <div className="flex flex-items-xs-between">
                    <div className="control-nav">
                        <div className="control-nav-inner flex">
                            <a className={!HistoryTracker.canGoBack() ? "disabled" : null} href="javascrip:void(0)"
                               onClick={this.goBack}>
                                <i className="icon-keyboard_arrow_left"></i>
                            </a>
                            <a className={!HistoryTracker.canGoForward() ? "disabled" : null} href="javascrip:void(0)"
                               onClick={this.goForward}>
                                <i className="icon-keyboard_arrow_right"></i>
                            </a>
                        </div>
                    </div>
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
