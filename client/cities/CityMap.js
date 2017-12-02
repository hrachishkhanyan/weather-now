import { ReactiveVar } from 'meteor/reactive-var';
const mapLoaded = new ReactiveVar(false);

Template.CityMap.onCreated(() => {
  Tracker.autorun(() => {
    const cityId = FlowRouter.getParam('cityId');
    const city = Cities.findOne(cityId);

    if(!city || !$('#map').length) {
      console.log('City is loading...');
    } else {
      initMap = function() {
        var currentCity = {lat: city.coords.lat, lng: city.coords.lng};
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 8,
          center: currentCity
        });
        var marker = new google.maps.Marker({
          position: currentCity,
          map: map
        });
      }
      initMap();
    }

  })
})


Template.CityMap.helpers({
  mapLoaded: () => {
    return mapLoaded.get();
  }
})
