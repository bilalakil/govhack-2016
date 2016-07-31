import React from 'react';

import Header from '../components/Header';

const SpeciesRow = (props) => {
    return (
        <tr>
            <td>{props.name}</td>
        </tr>
    )
};

const SightingsTable = (props) => {
    return (
        <div>
            <p>
                <strong>Species sighted: </strong> {props.speciesSeenNumber}
            </p>
            {props.sortedSpeciesList
              ? <table className="ui unstackable table">
                    <tbody>
                        {props.sortedSpeciesList.map((species, index) => <SpeciesRow key={index} name={species} id={species}/>)}
                    </tbody>
                </table>
              : <p>Go sight some species!</p>
            }
        </div>
    )
};

export default React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData() {
        const handle = Meteor.subscribe('leaderboard');
        return {
            ready: handle.ready(),
            user: Meteor.user()
        }
    },

    sortedSpeciesList() {
        return (this.data.user.profile ? this.data.user.profile.speciesName : 0);
    },

    speciesSeenNumber() {
        return (this.data.user.profile ? this.data.user.profile.speciesSeenNumber : 0);
    },

    render() {
        
        return (
            <div style={{height: '100%'}}>
                <div className="box fullSize">
                    <Header />
                    <div className="boxContent box">
                        <div className="ui container" style={{paddingTop: '20px'}}>
                            <h2 className="ui header">Your Sightings</h2>
                            {(this.data.ready) ? <SightingsTable speciesSeenNumber={this.speciesSeenNumber()} sortedSpeciesList={this.sortedSpeciesList()}/> : <div className="ui active loader"></div>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
})
