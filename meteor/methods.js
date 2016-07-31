Meteor.methods({
    markSpeciesAsSeen(speciesId) {
        if (!this.userId)
            throw new Meteor.Error(403, "You don't have permission to do that");

        Meteor.users.update(this.userId, {$addToSet: {'profile.speciesSeen': speciesId}, $inc: {'profile.speciesSeenNumber': 1}});
    }
});