import axios from 'axios';

Meteor.methods({
  'cities.insert' ({ city, countryName, coords, photoUrl }) {
    console.log(coords);
     return axios.get(`http://gd.geobytes.com/AutoCompleteCity?callback=?&q=${city}`)
       .then(res => {
         if(Cities.findOne({name: city})) {
           throw new Error('City is already on the list');
           return;
         }
          if(res.data.includes(city))
          {
            Cities.insert({ name: city, country: countryName, coords, photoUrl })
          } else {
            throw new Error('No such city')
          }
       })
       .catch(err => {
         throw new Meteor.Error(err.message);
       })
  },
  getWeather (city) {
    return axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${Meteor.settings.private.opm.apikey}`)
      .then(({ data }) => data)
      .catch(err => console.log('Err: ', err));
  },
  getData (city) {
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=${Meteor.settings.private.gp.apikey}`)
      .catch(err => console.log('Unable to get placeId'))
      .then(res => {
        const data = [res.data.results[0].place_id, _.last(res.data.results[0].formatted_address.split(' ')), res.data.results[0].geometry.location];
        return data;
      })
      .then((data) => {
        const coords = data[2];
        const countryName = data[1];
        return axios.get(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${data[0]}&key=${Meteor.settings.private.gp.apikey}`)
            .then(res => {
              const { photo_reference } =  res.data.result.photos[0];
              return [`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo_reference}&key=${Meteor.settings.private.gp.apikey}`, countryName, coords];
            })

      })
      .catch(err => {
        console.log('Err photo url: ', err);
      })
  },
  getUserCity(position) {
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${position[0]},${position[1]}&key=${Meteor.settings.private.gp.apikey}`)
      .then(res => {
        return res.data;
      })
      .catch(err => {
        console.log('Err getUserCity: ', err);
      })
  },
  getCityDesc(city) {
    return axios.get(`https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=${city}`)
      .then(res => {
        return res.data;
      })
      .catch(err => {
        console.log('Err getCityDesc: ', err);
      })
  }
})
