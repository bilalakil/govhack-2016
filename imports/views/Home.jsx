import React from 'react';

import MainView from './MainView';

const LocationPermissionDenied = () => {
    return (
        <div className="ui warning message">You must allow permissions!</div>
    )
};

export default class HomeView extends React.Component {
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
            <div>
                {this.state.requestingLocationPermission ? <div className="ui active loader"></div> : null}
                {this.state.locationPermissionDenied ? <LocationPermissionDenied /> : null}
                {this.state.coords ? <MainView coords={this.state.coords} /> : null}
            </div>
        );
    }
}