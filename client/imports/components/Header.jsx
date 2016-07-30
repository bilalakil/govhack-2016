import React from 'react';

export default class Header extends React.Component {
    constructor(props) {
        super(props);
        this.toggleMobileMenu = this.toggleMobileMenu.bind(this);
    }

    toggleMobileMenu(evt) {
        evt.preventDefault();
        $(this.slideMenu).transition('slide down');
    }

    render() {
        const sidebarStyle = {marginRight: 0};

        return (
            <div className="boxHeader" id="mobileNav">
                <div className="ui inverted menu">
                    <div id="brandHeader" className="header item">GaiaXplorers</div>
                    <div id="rightNav" className="right menu">
                        <h2 className="header item">
                            <i className="sidebar icon" style={sidebarStyle} onClick={this.toggleMobileMenu} />
                        </h2>
                    </div>
                </div>
                <div className="slideMenu" ref={(ref) => this.slideMenu = ref}>
                    <div className="ui inverted stackable menu">
                        <a href="#" className="item">
                            <i className="check icon" />
                            <span>Test</span>
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}