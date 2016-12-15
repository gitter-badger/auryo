import React, {Component, PropTypes} from "react"
import ReactDOM from "react-dom"
import cn from "classnames"

class toggleMoreComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            overflow: false
        }
    }

    componentDidMount() {
        const height = ReactDOM.findDOMNode(this.refs.overflow).clientHeight;
        const {overflow} = this.state;

        if (height > 200 && !overflow) {
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
            <div className={cn("overflow-container", {open: open})} >
                <div ref="overflow">
                    {this.props.children}
                </div>
                <a href="javascript:void(0)" onClick={this.toggleOpen.bind(this)}>{open ? "Show less" : "Show more"}</a>
            </div>
        )
    }

}
toggleMoreComponent.propTypes = {};

export default toggleMoreComponent;