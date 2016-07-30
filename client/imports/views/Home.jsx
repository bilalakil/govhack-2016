import React from 'react';

import MainView from './MainView';

//console.log(Injected.rawHead('viewport'));

export class Header extends React.Component {
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

const LocationPermissionDenied = () => {
    return (
        <div className="boxContent box">
            <div className="ui warning message">You must allow permissions!</div>
        </div>
    )
};

export class HomeView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            requestingLocationPermission: true,
            locationPermissionDenied: false,
            coords: null
        };
    }

    componentWillMount() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                console.log(position);
                this.setState({
                    requestingLocationPermission: false,
                    coords: position.coords
                });
            }, (error) => {
                console.log(error);
                this.setState({requestingLocationPermission: false, locationPermissionDenied: true});
            });
        } else {
            this.setState({requestingLocationPermission: false, locationPermissionDenied: true});
        }
    }

    render() {
        return (
            <div className="box fullSize">
                <Header />
                {this.state.requestingLocationPermission ? <div className="ui active loader"></div> : null}
                {this.state.locationPermissionDenied ? <LocationPermissionDenied /> : null}
                {this.state.coords ? <MainView coords={this.state.coords} /> : null}
            </div>
        );
    }
}