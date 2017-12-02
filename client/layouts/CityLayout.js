import { ReactiveVar } from 'meteor/reactive-var';
const location = new ReactiveVar('');
const weather = new ReactiveVar('');
const loaded = new ReactiveVar(false);


Template.CityLayout.onCreated(function(){
    this.autorun(() => {
      this.subscribe('cities');
    })
    


    const locationPromise = new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(function (position, err) {
          if(err) {
              reject(err);
          } else {
              resolve([position.coords.latitude, position.coords.longitude])
            }
      })
    });
    locationPromise.then(position => {
          const latlng = position;

          Meteor.call('getUserCity', latlng, function(err, res) {
            if(err) {
              console.log('Err getUserCity', err);
            } else
            {
              loaded.set(true);
              location.set(res.results[3].formatted_address.split(',')[0]);
              Meteor.call('getWeather', location.get(), function(err, res) {
                  if(err) {
                    console.log('Err get weather: ', err);
                  } else {
                    for (let i = 0; i < 5; i++) {
                      if(((new Date()).getHours() - 1) == res.list[i].dt_txt.split(' ')[1].split(':')[0]
                            || ((new Date()).getHours() + 1) == res.list[i].dt_txt.split(' ')[1].split(':')[0]
                            || ((new Date()).getHours() == res.list[i].dt_txt.split(' ')[1].split(':')[0])) {
                              weather.set(res.list[i].main.temp);
                            }

                    }
                  }

              })
            }
          })
      })
      .catch(err => {
        console.log('Error in Get Position: ', err);
      })
})



Template.CityLayout.helpers({
  name: () => {
    const cityId = FlowRouter.getParam('cityId');
    const city = Cities.findOne(cityId);
    if (!city) {
      return 'Loading...';
    }
    return city.name;
  },
  currentLocation: () => {
    return location.get();
  },
  weatherNow: () => {
    return weather.get();
  },
  loaded: () => {
    return loaded.get();
  }
})
