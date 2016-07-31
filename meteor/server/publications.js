Meteor.publish('leaderboard', () => {
    return Meteor.users.find({'profile.speciesSeenNumber': {$exists: true}}, {
        sort: {
            'profile.speciesSeenNumber': -1
        },
        limit: 50,
        fields: {
            'profile': true,
            'username': true
        }
    });
});