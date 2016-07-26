(function() {
  'use strict';

  angular
    .module('open.landing')
    .config(config);

  function config($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('landing', {
        url: '/landing',
        views: {
          '': {
            templateUrl: 'app/landing/landing.html',
            controller: 'LandingController as landing'
          }
        },
        data: {
          requiredLogin: false
        }
      });
    $urlRouterProvider.otherwise('/landing');
  }
})();