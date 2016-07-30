import React from 'react';

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
        this.state = {animalStartingIndex: 0};
    }

    componentWillMount() {
        const lat = this.props.coords.latitude,
            long = this.props.coords.longitude;

        HTTP.call('GET',
            `https://ydbb6eire4.execute-api.ap-southeast-2.amazonaws.com/beta/location?latitude=${lat}&longitude=${long}`,
            (err, res) => {
                if (err || res.statusCode !== 200) {
                    this.setState({hasError: true});
                } else {
                    console.log(res.data);
                    this.setState({allAnimals: res.data})
                }
            });
    }

    viewNextAnimals() {
        const allAnimals = this.state.allAnimals,
            currentIndex = this.animalStartingIndex;

        //add 4 to the starting index
    }

    viewPreviousAnimals() {

    }

    render() {
        if (this.state.hasError) {
            return <div className="ui error message">Error retrieving data</div>;
        }

        return (
            <div className="wrap">
                <section>

                </section>
                <footer>
                    <AnimalGallery animals={[1,2,3,4]} />
                </footer>
            </div>
        )
    }
}