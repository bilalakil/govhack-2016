import React from 'react';



export default class Layout extends React.Component {
    toggleMobileMenu(evt) {
        evt.preventDefault();
        $(this.slideMenu).transition('slide down');
    }

    render() {
        const sidebarStyle = {marginRight: 0};

        return (
            <div className="wrap">
                <header>
                    <div className="ui inverted menu">
                        <a href={FlowRouter.path('home')} id="brandHeader" className="header item">GaiaXplorers</a>
                        <div id="rightNav" className="right menu">
                            <h2 className="header item">
                                <i className="sidebar icon" style={sidebarStyle} onClick={(evt) => this.toggleMobileMenu(evt)} />
                            </h2>
                        </div>
                    </div>
                </header>
                <section>
                    {_.isFunction(this.props.content) ? this.props.content() : this.props.content}
                </section>
            </div>
        )
    }
}

Layout.propTypes = {
    content: React.PropTypes.any.isRequired
};