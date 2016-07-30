import React from 'react';

import GoogleMap from '../components/GoogleMap';
import AnimalGallery from '../components/AnimalGallery';
import {animalColors} from '../helpers';


export default class MainView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loading: true};
    }

    componentWillMount() {
        const lat = this.props.coords.latitude,
            long = this.props.coords.longitude;

        const testArr = [];

        for (let i = 0; i < 22; i++) {
            testArr.push(i + 1);
        }

        HTTP.call('GET',
             `${Meteor.settings.public.apiUrl}/location?latitude=${lat}&longitude=${long}`,
             (err, res) => {
                 if (err || res.statusCode !== 200) {
                    this.setState({hasError: true});
                 } else {
                     console.log(res.data);
                     let jsonData;
                     try {
                         jsonData = (typeof res.data === 'string') ? JSON.parse(res.data) : res.data;
                     } catch(e) {
                         console.error('Error parsing response');
                         console.error(e);
                     }

                     this.setState({loading: false, animalStartingIndex: 0, allAnimals: jsonData || []});
                 }
             });
    }

    viewNextAnimals(evt) {
        evt.preventDefault();
        const allAnimals = this.state.allAnimals,
            currentIndex = this.state.animalStartingIndex;

        if (allAnimals.length <= 4) return;

        //add 4 to the starting index
        let newIndex = currentIndex + 4;

        if (newIndex > allAnimals.length - 1) {
            //wrap around to start
            newIndex = 0;
        } else if (newIndex > allAnimals.length - 4) {
            newIndex = allAnimals.length - 4;
        }

        this.setState({animalStartingIndex: newIndex});
    }

    viewPreviousAnimals(evt) {
        evt.preventDefault();
        const allAnimals = this.state.allAnimals,
            currentIndex = this.state.animalStartingIndex;

        if (allAnimals.length <= 4) return;

        // minus 4 to starting index
        let newIndex = currentIndex - 4;

        if (newIndex < -3) {
            //wrap around the other side
            newIndex = allAnimals.length - 4;
        } else if (newIndex < 0) {
            newIndex = 0;
        }
        this.setState({animalStartingIndex: newIndex});
    }

    getCurrentAnimals() {
        const index = this.state.animalStartingIndex,
            animals = this.state.allAnimals.slice(index, index + 4);
        console.log(animals);
        return animals;
    }

    render() {
        if (this.state.hasError) {
            return <div className="ui error message">Error retrieving data</div>;
        }

        if (this.state.loading) {
            return <div className="ui active loader"></div>;
        }

        return (
            <div className="boxContent box">
                <div className="boxContent googleMap">
                    <GoogleMap lat={this.props.coords.latitude} long={this.props.coords.longitude} animals={this.getCurrentAnimals()}/>
                </div>
                {(this.state.allAnimals ? <AnimalGallery
                    animals={this.getCurrentAnimals()}
                    viewNext={this.viewNextAnimals.bind(this)}
                    viewPrevious={this.viewPreviousAnimals.bind(this)}
                /> : null)}
            </div>
        )
    }
}