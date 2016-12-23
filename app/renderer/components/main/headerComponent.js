import React, {Component} from "react";
import HistoryTracker from "back-forward-history";

import "../../assets/css/common/header.scss"

class Header extends Component {

    static goBack() {
        if (HistoryTracker.canGoBack()) {
            Header.goBack();
        }
    }

    static goForward() {
        if (HistoryTracker.canGoForward()) {
            Header.goForward();
        }
    }

    render() {
        return (
            <nav className="navbar navbar-dark navbar-fixed-top">
                <div className="flex flex-items-xs-between">
                    <div className="control-nav">
                        <div className="control-nav-inner flex">
                            <a className={!HistoryTracker.canGoBack() ? "disabled" : null} href="javascrip:void(0)"
                               onClick={Header.goBack}>
                                <i className="icon-keyboard_arrow_left"/>
                            </a>
                            <a className={!HistoryTracker.canGoForward() ? "disabled" : null} href="javascrip:void(0)"
                               onClick={Header.goForward}>
                                <i className="icon-keyboard_arrow_right"/>
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
