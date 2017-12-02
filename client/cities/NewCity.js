import isoCountries from '/countryCodes.js';;
import { ReactiveVar } from 'meteor/reactive-var';

const ErrorMessage = new ReactiveVar('');

Template.NewCity.events({
  submit: function (event) {
      event.preventDefault();

      const input = $('#input');
      const inputText = input.val().split(',');
      const city = inputText[0];

      if(!city) {
        return;
      } else {
        Meteor.call('getData', city, (err, res) => {
          const photoUrl = '';
          if (err) {
            console.log('Unable to get city photo');
          } else {
            photoUrl = res[0];
            countryName = res[1];
            coords = res[2];
          }
          Meteor.call('cities.insert', { city, countryName, coords, photoUrl }, (err, res) => {
            if(err) {
              if(err.message) {
                ErrorMessage.set(err.error);
              }

              console.log('Err: ', err);
              } else {
                  ErrorMessage.set(' ');
                  input.val('');
                }
          })
        })
      }
  }
  })

  Template.NewCity.helpers({
    ErrorMsg: () => {
        return ErrorMessage.get();

    }
  })
