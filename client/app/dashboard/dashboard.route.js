(function() {
  'use strict';

  angular
    .module('open.dashboard')
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('dashboard', {
        url: '/dashboard',
        views: {
          '': {
            templateUrl: 'app/dashboard/dashboard.html',
            controller: 'DashboardController as dashboard'
          }
        },
        data: {
          requiredLogin: true
        }
      });
  }
})();