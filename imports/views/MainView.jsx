import React from 'react';

import GoogleMap from '../components/GoogleMap';

const SingleAnimal = (props) => {
    return (
        <div className="singleAnimal">
            <img src="//placehold.it/600x600" />
        </div>
    )
};

const AnimalGallery = React.createClass({
    render() {
        return (
            <div id="animalGallery">
                {this.props.animals.map((val, index) => <SingleAnimal key={index} />)}
            </div>
        )
    }
});

export default class MainView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loading: true};
        this.viewNextAnimals = this.viewNextAnimals.bind(this);
        this.viewPreviousAnimals = this.viewPreviousAnimals.bind(this);
    }

    componentWillMount() {
        const lat = this.props.coords.latitude,
            long = this.props.coords.longitude;

        const testArr = [];

        for (let i = 0; i < 100; i++) {
            testArr.push([]);
        }

        /*HTTP.call('GET',
         `https://ydbb6eire4.execute-api.ap-southeast-2.amazonaws.com/beta/location?latitude=${lat}&longitude=${long}`,
         (err, res) => {
         if (err || res.statusCode !== 200) {
         this.setState({hasError: true});
         } else {
         console.log(res.data);
         this.setState({loading: false, animalStartingIndex: 0, allAnimals: JSON.parse(res.data)})
         }
         });*/
        this.setState({loading: false, animalStartingIndex: 0, allAnimals: testArr})
    }

    viewNextAnimals() {
        const allAnimals = this.state.allAnimals,
            currentIndex = this.state.animalStartingIndex;

        if (allAnimals.length <= 4) return;

        //add 4 to the starting index
        let newIndex = currentIndex + 4;

        if (newIndex > allAnimals.length - 1) {
            //wrap around to start
            newIndex = 0;
        } else if (allAnimals.length - 5 < newIndex) {
            // show the last 4 animals
            newIndex = allAnimals.length - 5;
        }

        this.setState({animalStartingIndex: newIndex});
    }

    viewPreviousAnimals() {
        const allAnimals = this.state.allAnimals,
            currentIndex = this.state.animalStartingIndex;

        if (allAnimals.length <= 4) return;

        // minus 4 to starting index
        let newIndex = currentIndex - 4;

        if (newIndex < -3) {
            //wrap around the other side
            newIndex = allAnimals.length - 5;
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
                    <GoogleMap />
                </div>
                <div className="boxFooter">
                    {(this.state.allAnimals ? <AnimalGallery animals={this.getCurrentAnimals()} /> : null)}
                </div>
            </div>
        )
    }
}