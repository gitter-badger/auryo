import React, {Component, PropTypes} from "react";
import ReactDOM from "react-dom";
import cn from "classnames";

class InfiniteScroll extends Component {
    constructor(props) {
        super(props);
        this.onScroll = this.onScroll.bind(this);
        this.state = {
            el: null
        }
    }

    componentDidMount() {
        ReactDOM.findDOMNode(this.refs.scroll).addEventListener('scroll', this.onScroll, false);
    }

    componentWillUnmount() {
        ReactDOM.findDOMNode(this.refs.scroll).removeEventListener('scroll', this.onScroll, false);
    }

    onScroll() {
        const {dispatch, scrollFunc, fastScrolling} = this.props;

        const el = ReactDOM.findDOMNode(this.refs.scroll);
        const box = el.getBoundingClientRect();
        const scroll_height = (el.scrollHeight - box.bottom) + box.top;
        let offset = 50;

        if (fastScrolling) {
            offset += 400;
        }

        if (el.scrollTop >= (scroll_height - offset)) {
          if(dispatch){
            dispatch(scrollFunc());
          } else {
            scrollFunc();
          }
        }
    }

    render() {
        const {playing} = this.props;

        return (
            <div ref="scroll" className={cn("scroll", {playing: playing})}>
                {this.props.children}
            </div>
        )
    }
}

InfiniteScroll.propTypes = {
    dispatch: PropTypes.func,
    scrollFunc: PropTypes.func.isRequired,
    playing: PropTypes.bool.isRequired,
    fastScrolling: PropTypes.bool
};

export default InfiniteScroll;
