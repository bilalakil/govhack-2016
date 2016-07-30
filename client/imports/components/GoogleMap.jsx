import React from 'react';

import GoogleMapsAPI from 'google-maps-api';
const mapsapi = GoogleMapsAPI(Meteor.settings.public.googleMapsApiKey);

export default class GoogleMap extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        mapsapi().then((maps) => {
            const latlong = new maps.LatLng(this.props.lat, this.props.long);

            this.googleMapObject = new maps.Map(this.googleMap, {
                center: latlong,
                zoom: 15,
                mapTypeId: maps.MapTypeId.ROADMAP,
                mapTypeControl: false,
                disableDefaultUI: true,
                scrollwheel: false,
                scaleControl: false,
                draggable: false,
                navigationControl: false,
                streetViewControl: false
            });

            var marker = new maps.Marker({
                position: latlong,
                icon: {
                    path: maps.SymbolPath.CIRCLE,
                    scale: 5,
                    strokeColor: '#393',
                    fillColor: '#393',
                    fillOpacity: 1
                },
                map: this.googleMapObject,
                title:"You are here!"
            });
        });
    }

    render() {
        const mapStyle = {position: 'absolute', width: '100%', height: '100%'};
        return (
            <div style={mapStyle} ref={(ref) => this.googleMap = ref}>

            </div>
        )
    }
}