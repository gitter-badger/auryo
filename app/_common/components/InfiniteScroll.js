import React, {Component, PropTypes} from "react";
import ReactDOM from "react-dom";

export default function (InnerComponent) {
  class InfiniteScrollComponent extends Component {
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
      var el = ReactDOM.findDOMNode(this.refs.scroll);
      const box = el.getBoundingClientRect();
      const scroll_height = (el.scrollHeight - box.bottom) + box.top;

      if (el.scrollTop >= (scroll_height - 400)) {
        const {dispatch, scrollFunc} = this.props;
        dispatch(scrollFunc());
      }
    }

    render() {
      return (
        <div>
          <InnerComponent ref="scroll" {...this.props} />
        </div>
        )
    }
  }

  InfiniteScrollComponent.propTypes = {
    dispatch: PropTypes.func.isRequired,
    scrollFunc: PropTypes.func.isRequired,
  };

  return InfiniteScrollComponent;
}
