import { Meteor } from 'meteor/meteor';

Cities.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Meteor.startup(() => {
  // code to run on server at startup
});
