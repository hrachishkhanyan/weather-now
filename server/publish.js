Meteor.publish('cities', function() {
  return Cities.find({});
})
