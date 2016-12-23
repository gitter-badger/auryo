import React, {Component, PropTypes} from "react"
import ReactDOM from "react-dom"
import cn from "classnames"

class ToggleMore extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            overflow: false,
            check_height: props.height || 200
        }
    }

    componentDidMount() {
        const height = ReactDOM.findDOMNode(this.refs.overflow).clientHeight;
        const {overflow, check_height} = this.state;

        if (height > check_height && !overflow) {
            this.setState({
                overflow: true
            })
        }

    }

    toggleOpen() {
        const {open} = this.state;

        this.setState({
            open: !open
        })
    }

    render() {
        const {overflow, open} = this.state;

        if (!overflow) {
            return (
                <div ref="overflow">
                    {this.props.children}
                </div>
            )
        }

        return (
            <div className={cn("overflow-container", {open: open})}>
                <div className="overflow-div" ref="overflow">
                    {this.props.children}
                </div>
                <div className="overflow-bottom">
                    <a className="overflow-button" href="javascript:void(0)" onClick={this.toggleOpen.bind(this)}>
                        <i className={"icon-" + (open ? "keyboard_arrow_up" : "keyboard_arrow_down")}/>
                    </a>
                </div>
            </div>
        )
    }

}
ToggleMore.propTypes = {
    height: PropTypes.number
};

export default ToggleMore;