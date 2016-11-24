import React, {Component, PropTypes} from "react";
import {getImageUrl,formatDescription} from "../../_common/utils/soundcloudUtils"
import {IMAGE_SIZES} from "../../_common/constants/Soundcloud"
import {Row,Col} from "reactstrap"
import moment from "moment";


class CommentList extends Component {

  render() {
    const {comments} = this.props;


    return (
      <div className="comments">
        {
          comments.map(function (comment, i) {

            const img = getImageUrl(comment.user.avatar_url,IMAGE_SIZES.XSMALL);

            return (
              <Row className="comment" key={i}>
                <div className="comment-user col-xs no-grow">
                  <img width={50} height={50} src={img} />
                </div>
                <Col xs="8" className="comment-main">
                  <div className="info flex">
                    <div>{comment.user.username}</div>
                    <span className="divider flex-xs-middle"></span>
                    <div className="text-muted">
                      { moment(comment.created_at, "YYYY-MM-DD HH:mm Z").fromNow()}
                    </div>
                  </div>
                  <div className="comment-body" dangerouslySetInnerHTML={formatDescription(comment.body)}></div>
                </Col>
              </Row>
            )
          })
        }
      </div>
    )
  }
}

CommentList.propTypes = {
  comments: PropTypes.array.isRequired
};

export default CommentList;
