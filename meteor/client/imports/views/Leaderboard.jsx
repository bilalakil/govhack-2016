import React from 'react';

import Header from '../components/Header';

const LeaderboardTableRow = (props) => {
    return (
        <tr>
            <td>{props.username}</td>
            <td>{props.speciesSeenNumber}</td>
        </tr>
    )
};

const LeaderboardTable = (props) => {
    return (
        <table className="ui unstackable table">
            <thead>
                <tr>
                    <th>Username</th>
                    <th>Species seen</th>
                </tr>
            </thead>
            <tbody>
                {props.users.map((user, index) => <LeaderboardTableRow key={index} {...user}/>)}
            </tbody>
        </table>
    )
};

export default React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData() {
        const handle = Meteor.subscribe('leaderboard');
        return {
            ready: handle.ready(),
            users: Meteor.users.find({'profile.speciesSeenNumber': {$exists: true}}).fetch()
        }
    },

    sortedUserList() {
        if (this.data.users) {
            return this.data.users.sort((a, b) => {
                return (b.profile.speciesSeenNumber - a.profile.speciesSeenNumber);
            }).map((user) => {
                return {
                    username: user.username || user.profile.name,
                    speciesSeenNumber: user.profile.speciesSeenNumber
                }
            });
        }

        return [];
    },

    render() {
        return (
            <div style={{height: '100%'}}>
                <div className="box fullSize">
                    <Header />
                    <div className="boxContent box">
                        <div className="ui container" style={{paddingTop: '20px'}}>
                            {(this.data.ready) ? <LeaderboardTable users={this.sortedUserList()} /> : <div className="ui active loader"></div>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
})