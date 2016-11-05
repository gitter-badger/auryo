// @flow
import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';


class PageHeader extends Component {

    render() {
        const {title} = this.props;

        return (
            <h2>{title}</h2>
        );
    }
}

PageHeader.propTypes = {
    title: PropTypes.string.isRequired
};

export default PageHeader;