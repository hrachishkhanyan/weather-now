import { ReactiveVar } from 'meteor/reactive-var';
const cityDesc = new ReactiveVar('');

Template.CityDescription.onCreated(() => {
  Tracker.autorun(() => {
    const moreButton = $('#showMoreButton');
    const lessButton = $('#showLessButton');
    const descriptionBox = $('#descriptionBox');

    moreButton.click(function() {
      moreButton.addClass('hidden');
      descriptionBox.addClass('show');
      lessButton.removeClass('hidden');
    })

    lessButton.click(function() {
      lessButton.addClass('hidden');
      descriptionBox.removeClass('show');
      moreButton.removeClass('hidden');
    })

    const cityId = FlowRouter.getParam('cityId')
    const city = Cities.findOne(cityId);
    if(!city) {
      console.log('Couldn\'t find the city');
    } else {
      Meteor.call('getCityDesc', city.name, function(err, res) {
        if(err) {
          console.log('Err in city desc: ', err)
        } else {
          const pageId = Object.keys(res.query.pages)[0];
          cityDesc.set(res.query.pages[pageId].extract);

        }
      })
    }
  })
})

Template.CityDescription.helpers({
  description: () => {
    return cityDesc.get();
  }
})
