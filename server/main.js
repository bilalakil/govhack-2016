import { Meteor } from 'meteor/meteor';

Inject.rawHead('viewport', '<meta name="viewport" content="width=device-width, initial-scale=1">');

Meteor.startup(() => {
  // code to run on server at startup
});
