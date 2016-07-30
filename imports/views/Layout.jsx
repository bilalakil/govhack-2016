import React from 'react';

export default class Layout extends React.Component {
    render() {
        return (
            <div>
                {_.isFunction(this.props.content) ? this.props.content() : this.props.content}
            </div>
        )
    }
}

Layout.propTypes = {
    content: React.PropTypes.any.isRequired
};