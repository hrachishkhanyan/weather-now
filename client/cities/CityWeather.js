import { ReactiveVar } from 'meteor/reactive-var';
const weatherData = new ReactiveVar('');
const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

Template.CityWeather.onCreated(() => {
  Tracker.autorun(() => {
    const cityId = FlowRouter.getParam('cityId');
    const city = Cities.findOne(cityId);

    if(!city) {
      console.log('Unable to find city');
    } else {
      const cityName = city.name;
      const weatherPromise = new Promise((resolve, reject) => {
        Meteor.call('getWeather', cityName, function(err, res) {
          if(err) {
            reject(err);
          } else {
            resolve(res);
          }
        })
      });

      weatherPromise.then(res => {
        weatherData.set(res);
        const newArr = _.map(weatherData.get().list, _.clone);

        var arr = _.filter(newArr, function(element) {
          return element.dt_txt.split(' ')[1] == '15:00:00' || element.dt_txt.split(' ')[1] == '03:00:00';
        })
        google.charts.load('current', {packages: ['corechart', 'line']});
        google.charts.setOnLoadCallback(drawBackgroundColor);

        function drawBackgroundColor() {

          var data = new google.visualization.DataTable();
          data.addColumn('string', 'X');
          data.addColumn('number', 'Daytime Temperature');
          data.addColumn('number', 'Nighttime Temperature');

          data.addRows([['Today', arr[0].main.temp, arr[1].main.temp]]);
          for (let i = 0; i <= arr.length - 3; i+=2) {
            // if((new Date()).getDay() + i > 6) {
            //
            // }
            data.addRows([
              [weekDays[(new Date()).getDay() + 1 + i/2], arr[i+2].main.temp, arr[i+3].main.temp]

            ]);
          }

          var options = {
            hAxis: {
              title: 'Days'
            },
            vAxis: {
              title: 'Temperature'
            },
            backgroundColor: 'transparent'
          };

          var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
          chart.draw(data, options);
        }
      });
    }
  });
  const weatherArr = weatherData.get();



});

  Template.CityWeather.helpers({
    weatherDay: function() {
      const newArr = _.map(weatherData.get().list, _.clone);

      var arr = _.filter(newArr, function(element) {
        return element.dt_txt.split(' ')[1] == '15:00:00';
      })

      return arr;
    }
    ,
    weatherNight: function() {
      const newArr = _.map(weatherData.get().list, _.clone);

      var arr = _.filter(newArr, function(element) {
        return element.dt_txt.split(' ')[1] == '03:00:00';
      })

      return arr;
    },
    date: function() {
      var days = [];
      for(let i = 1; i < 5; i++){
        if((new Date()).getDay() + i > 6) {
          days[i-1] = weekDays[(new Date()).getDay()-1];

        } else
          {days[i-1] = weekDays[(new Date()).getDay() + i]}
      }
      return days;
    }
  })
