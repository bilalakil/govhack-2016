import React from 'react';

import GoogleMapsAPI from 'google-maps-api';
const mapsapi = GoogleMapsAPI(Meteor.settings.public.googleMapsApiKey);
const collidingMarkerShift = 0.0005;

import {animalColors} from '../helpers';

export default class GoogleMap extends React.Component {
    constructor(props) {
        super(props);
        this.setAnimalMarkers = this.setAnimalMarkers.bind(this);
        this.deleteMarkers = this.deleteMarkers.bind(this);
    }

    componentDidMount() {
        mapsapi().then((maps) => {
            const latlong = new maps.LatLng(this.props.lat, this.props.long);
            this.maps = maps;
            this.markers = [];

            this.googleMapObject = new this.maps.Map(this.googleMap, {
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
            //this.setAnimalMarkers(this.props);
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setAnimalMarkers(nextProps);
    }

    deleteMarkers() {
        if (this.markers) {
            for (var i = 0; i < this.markers.length; i++) {
                this.markers[i].setMap(null);
            }
            this.markers = [];
        }
    }

    setAnimalMarkers(props) {
        console.log(props.animals);
        if (!props.animals || props.animals.length === 0) return;

        const animalIds = props.animals.map((animal) => animal.speciesId),
            lat = this.props.lat,
            long = this.props.long;

        const setSingleMarker = (color, lat, long) => {
            lat = parseFloat(lat);
            long = parseFloat(long);

            if (this.markers) {
                for (let i = 0; i < this.markers.length; i++) {
                    if (this.markers[i].position.lat() === lat && this.markers[i].position.lng() === long) {
                        if (this.markers[i].icon.fillColor === color) {
                            return;
                        }
                        lat = lat - collidingMarkerShift + Math.random() * collidingMarkerShift * 3;
                        long = long - collidingMarkerShift + Math.random() * collidingMarkerShift * 3;
                        break;
                    }
                }
            }

            const latlong = new this.maps.LatLng(lat, long);

            this.markers.push(new this.maps.Marker({
                position: latlong,
                icon: {
                    path: this.maps.SymbolPath.CIRCLE,
                    scale: 5,
                    strokeColor: color,
                    fillColor: color,
                    fillOpacity: 1
                },
                map: this.googleMapObject
            }));
        };

        const httpUrl = `${Meteor.settings.public.apiUrl}/sightings?latitude=${lat}&longitude=${long}&radius=1.0&species_ids=${animalIds.map((v) => encodeURIComponent(v)).join(',')}`;

        this.deleteMarkers();

        HTTP.call(
            'get',
            httpUrl,
            (err, res) => {
                if (err || res.statusCode !== 200) {
                    console.log('error getting sightings');
                    console.error(err);
                } else {
                    const data = res.data;
                    console.log('GOT location data');
                    console.log(data);

                    animalIds.map((animalId, index) => {
                        if (data[animalId]) {
                            const color = animalColors[index];
                            data[animalId].map((coords) => {
                                setSingleMarker(color, coords[0], coords[1]);
                            });
                        }
                    });
                }
            }
        )
    }

    render() {
        const mapStyle = {position: 'absolute', width: '100%', height: '100%'};
        return (
            <div style={mapStyle} ref={(ref) => this.googleMap = ref}>

            </div>
        )
    }
}
