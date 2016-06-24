(function() {
  'use strict';

  angular
    .module('open.landing')
    .config(config);

  function config($stateProvider) {
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
  }
})();