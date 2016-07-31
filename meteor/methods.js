Meteor.methods({
    markSpeciesAsSeen(speciesId, speciesName, speciesImageUrl) {
        if (!this.userId)
            throw new Meteor.Error(403, "You don't have permission to do that");

        Meteor.users.update(this.userId, {$addToSet: {'profile.speciesSeen': {speciesId,speciesName,speciesImageUrl}}, $inc: {'profile.speciesSeenNumber': 1}});
    }
});