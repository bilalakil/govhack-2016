import { Meteor } from 'meteor/meteor';

Inject.rawHead('viewport', '<meta name="viewport" content="width=device-width, initial-scale=1">');

Meteor.startup(() => {
    ServiceConfiguration.configurations.update(
        { service : "google" },
        {
            $set: {
                clientId: Meteor.settings.google.clientId,
                secret: Meteor.settings.google.clientSecret
            }
        },
        { upsert: true }
    );
});
