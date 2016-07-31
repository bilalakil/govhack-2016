import React from 'react';

import Header from '../components/Header';

const LeaderboardTableRow = (props) => {
    return (
        <tr className={(props.isCurrentUser(props.id) ? 'active': '')}>
            <td>{props.rank}</td>
            <td>{props.username}</td>
            <td>{props.speciesSeenNumber}</td>
        </tr>
    )
};

const LeaderboardTable = (props) => {
    return (
        <div>
            <p>
                <strong>Your ranking: </strong> {props.position}
            </p>
            <table className="ui unstackable table">
                <thead>
                <tr>
                    <th></th>
                    <th>Username</th>
                    <th>Species seen</th>
                </tr>
                </thead>
                <tbody>
                    {props.users.map((user, index) => <LeaderboardTableRow key={index} rank={index + 1} {...user} isCurrentUser={props.isCurrentUser} />)}
                </tbody>
            </table>
        </div>
    )
};

export default React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData() {
        const handle = Meteor.subscribe('leaderboard');
        return {
            ready: handle.ready(),
            users: Meteor.users.find({'profile.speciesSeenNumber': {$exists: true}}).fetch(),
            currentUserId: Meteor.userId()
        }
    },

    sortedUserList() {
        if (this.data.users) {
            return this.data.users.sort((a, b) => {
                return (b.profile.speciesSeenNumber - a.profile.speciesSeenNumber);
            }).map((user) => {
                return {
                    id: user._id,
                    username: user.username || user.profile.name,
                    speciesSeenNumber: user.profile.speciesSeenNumber
                }
            });
        }

        return [];
    },

    leaderboardPosition() {
        if (this.data.currentUserId) {
            const userList = this.sortedUserList();
            let index = -1;
            for (let i = 0; i < userList.length; i++) {
                if (userList[i].id === this.data.currentUserId) {
                    index = i;
                    break;
                }
            }

            if (index > -1) {
                return index + 1;
            }
        }

        return 'Not ranked. Go spot some wildlife!';
    },

    isCurrentUser(id) {
        return (this.data.currentUserId === id);
    },

    render() {
        return (
            <div style={{height: '100%'}}>
                <div className="box fullSize">
                    <Header />
                    <div className="boxContent box">
                        <div className="ui container" style={{paddingTop: '20px'}}>
                            <h2 className="ui header">Leaderboard</h2>
                            {(this.data.ready) ? <LeaderboardTable users={this.sortedUserList()} position={this.leaderboardPosition()} isCurrentUser={this.isCurrentUser} /> : <div className="ui active loader"></div>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
})