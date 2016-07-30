import React from 'react';

import MainView from './MainView';
import Header from '../components/Header';
import SpeciesModalContainer from '../components/SpeciesModal';


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
            <div style={{height: '100%'}}>
                <div className="box fullSize">
                    <Header />
                    {this.state.requestingLocationPermission ? <div className="ui active loader"></div> : null}
                    {this.state.locationPermissionDenied ? <LocationPermissionDenied /> : null}
                    {this.state.coords ? <MainView coords={this.state.coords} /> : null}
                </div>
                <SpeciesModalContainer/>
            </div>
        );
    }
}