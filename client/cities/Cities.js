Template.Cities.onCreated(function(){
  this.autorun(() => {
    this.subscribe('cities');
  })
});

Template.Cities.helpers({
  cities: () => {
    return Cities.find();
  }
});
