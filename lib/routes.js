FlowRouter.route('/home', {
  name: 'home',
  action () {
    BlazeLayout.render('MainLayout', {main: 'Cities'});
  }
})

FlowRouter.route('/', {
  name: 'blank',
  action () {
    FlowRouter.go('home');
  }
})

FlowRouter.route('/city/:cityId', {
  name: 'city',
  action () {
    BlazeLayout.render('CityLayout');
  }
})
