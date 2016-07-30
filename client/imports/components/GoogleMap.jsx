import React from 'react';

import GoogleMapsAPI from 'google-maps-api';
const mapsapi = GoogleMapsAPI(Meteor.settings.public.googleMapsApiKey);

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

            this.setAnimalMarkers(this.props);
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setAnimalMarkers(nextProps);
    }

    deleteMarkers() {
        console.log(this.markers);
        for (var i = 0; i < this.markers.length; i++) {
            this.markers[i].setMap(null);
        }
        this.markers = [];
    }

    setAnimalMarkers(props) {
        console.log(props.animals);
        const animalIds = props.animals.map((animal) => animal.speciesId),
            lat = this.props.lat,
            long = this.props.long;

        const setSingleMarker = (color, lat, long) => {
            lat = parseFloat(lat);
            long = parseFloat(long);
            const latlong = new this.maps.LatLng(lat, long);

            for (let i = 0; i < this.markers.length; i++) {
                console.log(this.markers[i].position.lat(), lat);
                console.log(this.markers[i]);
                console.log(this.markers[i].position.lng(), long);


                if (this.markers[i].position.lat() === lat && this.markers[i].position.lng() === long) {
                    console.log('collish');
                    lat = lat - 0.0015 + Math.random() * 0.03;
                    long = long - 0.0015 + Math.random() * 0.03;
                    break;
                }
            }

            console.log('Setting marker at ', lat, long);



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

        const httpUrl = `${Meteor.settings.public.apiUrl}/sightings?latitude=${lat}&longitude=${long}&radius=2.0&species_ids=${animalIds.map((v) => encodeURIComponent(v)).join(',')}`;
        console.log(httpUrl);

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
                    console.log('GOT DATAAAA');
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