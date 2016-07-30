import React from 'react';

import {Header} from './Home';

export default class LoginView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="box fullSize">
                <Header />
                <div className="boxContent box">
                    <div className="ui container" style={{paddingTop: '20px'}}>
                        {_.isFunction(this.props.content) ? this.props.content() : this.props.content}
                    </div>
                </div>
            </div>
        );
    }
}