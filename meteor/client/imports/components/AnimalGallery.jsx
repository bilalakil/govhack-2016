import React from 'react';

import {animalColors} from '../helpers';

class SingleAnimal extends React.Component {
    constructor(props) {
        super(props);
        this.clickAnimal = this.clickAnimal.bind(this);
        this.getImageUrl = this.getImageUrl.bind(this);
        this.state = {imageUrl: null}
    }

    getImageUrl(speciesId) {
        this.setState({imageUrl: null});
        HTTP.call('GET',
            `${Meteor.settings.public.apiUrl}/image/${speciesId}`,
            (err, res) => {
                if (err || res.statusCode !== 200) {
                    console.error('Error getting image URL');
                    console.error(err);
                } else if (!res.data || res.data.length === 0) {
                    console.log('No image for this speciesId');
                } else {
                    this.setState({imageUrl: res.data});
                }
            }
        );
    }

    componentWillMount() {
        this.getImageUrl(this.props.speciesId);
    }

    componentWillReceiveProps(nextProps) {
        this.getImageUrl(nextProps.speciesId);
    }

    clickAnimal(evt) {
        evt.preventDefault();
        Session.set('watchingSpeciesId', this.props.speciesId);
        Session.set('watchingSpeciesName', this.props.name);
        Session.set('watchingSpeciesImageUrl', this.state.imageUrl);
        $('#speciesModal').modal('show');
    }

    render() {
        const contentStyle = {backgroundImage: `url('${this.state.imageUrl || '//placehold.it/600x600'}')`},
            colorStyle = {backgroundColor: animalColors[this.props.colorIndex]};

        return (
            <div className="singleAnimal" onClick={(evt) => this.clickAnimal(evt)}>
                <div style={contentStyle} className="content"></div>
                <div className="colorBar" style={colorStyle}></div>
                {this.props.seen(this.props.speciesId) ? <div className="seenIcon"><i className="eye icon"></i></div> : null}
                <p>{this.props.name}</p>
            </div>
        )
    }
}

export default React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData() {
        const data = {},
            user = Meteor.user();

        if (user && user.profile && user.profile.speciesSeen) {
            data.speciesSeen = user.profile.speciesSeen;
        }

        return data;
    },
    isSeen(speciesId) {
        if(!this.data.speciesSeen) return false;
        
        let speciesIdFound = false;

        for(let species of this.data.speciesSeen) {
            if(species.speciesId === speciesId) {
                speciesIdFound = true;
                break;
            }
        }

        return speciesIdFound;
    },
    render() {
        if (!this.props.animals || this.props.animals.length === 0) {
            return (
                <div id="animalGallery" className="boxFooter">
                    <div className="ui message" style={{flexGrow: 1}}>
                        <div className="header">No data</div>
                        <div className="description">Maybe try another location?</div>
                    </div>
                </div>
            );
        }

        return (
            <div id="animalGallery" className="boxFooter">
                {this.props.animals.map((val, index) => <SingleAnimal key={index} colorIndex={index} seen={this.isSeen} {...val} />)}
                <a href="#" className="arrow left" onClick={this.props.viewPrevious}><i className="angle left icon"></i></a>
                <a href="#" className="arrow right" onClick={this.props.viewNext}><i className="angle right icon"></i></a>
            </div>
        )
    }
});