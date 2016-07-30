import React from 'react';

import GoogleMap from '../components/GoogleMap';
import {animalColors} from '../helpers';

const SingleAnimal = (props) => {
    const contentStyle = {backgroundImage: "url('//placehold.it/600x600')"},
        colorStyle = {backgroundColor: animalColors[props.colorIndex]};

    return (
        <div className="singleAnimal">
            <div style={contentStyle} className="content"></div>
            <div className="colorBar" style={colorStyle}></div>
            {props.seen ? <div className="seenIcon"><i className="eye icon"></i></div> : null}
        </div>
    )
};

const AnimalGallery = React.createClass({
    render() {
        return (
            <div id="animalGallery" className="boxFooter">
                {this.props.animals.map((val, index) => <SingleAnimal key={index} colorIndex={index} seen={true} />)}
                <a href="#" className="arrow left" onClick={this.props.viewPrevious}><i className="angle left icon"></i></a>
                <a href="#" className="arrow right" onClick={this.props.viewNext}><i className="angle right icon"></i></a>
            </div>
        )
    }
});

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
        this.setState({loading: false, animalStartingIndex: 0, allAnimals: testArr});
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
                    <GoogleMap lat={this.props.coords.latitude} long={this.props.coords.longitude}/>
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