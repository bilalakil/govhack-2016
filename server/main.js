import { Meteor } from 'meteor/meteor';

Inject.rawHead('viewport', '<meta name="viewport" content="width=device-width, initial-scale=1">');

Meteor.startup(() => {
    // login service configuration
    ServiceConfiguration.configurations.update(
        { "service": "facebook" },
        {
            $set: {
                "appId": Meteor.settings.facebook.appId,
                "secret": Meteor.settings.facebook.appSecret
            }
        },
        { upsert: true }
    );
});
