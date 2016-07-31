import React from 'react';

export default React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData() {
        return {
            loggedIn: (Meteor.userId())
        }
    },
    toggleMobileMenu(evt) {
        if (evt) evt.preventDefault();
        $(this.slideMenu).transition('slide down');
    },

    signOut(evt) {
        evt.preventDefault();
        this.toggleMobileMenu();
        Meteor.logout();
    },

    render() {
        const sidebarStyle = {marginRight: 0};

        return (
            <div className="boxHeader" id="mobileNav">
                <div className="ui inverted menu">
                    <a id="brandHeader" className="header item" href="/">
                        <img src="/gaiaxplorers-logo.png" />
                    </a>
                    <div id="rightNav" className="right menu">
                        <h2 className="header item">
                            <i className="sidebar icon" style={sidebarStyle} onClick={this.toggleMobileMenu} />
                        </h2>
                    </div>
                </div>
                <div className="slideMenu" ref={(ref) => this.slideMenu = ref}>
                    <div className="ui inverted stackable menu">
                        {(() => {
                            if (!this.data.loggedIn) {
                                return (
                                    <a href="/sign-in" className="item">
                                        Sign in
                                    </a>
                                )
                            } else {
                                return (
                                    <a href="#" className="item" onClick={(evt) => this.signOut(evt)}>
                                        Sign out
                                    </a>
                                )
                            }
                        })()}
                        <a href="/sightings" className="item">Sightings</a>
                        <a href="/leaderboard" className="item">Leaderboard</a>
                    </div>
                </div>
            </div>
        );
    }
});
