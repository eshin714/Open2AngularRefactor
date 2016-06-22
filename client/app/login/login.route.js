(function() {
  'use strict';

  angular
    .module('open.login')
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        views: {
          '': {
            templateUrl: 'app/login/login.html',
            controller: 'LoginController as login'
          }
        },
        data: {
          requiredLogin: false
        }
      });
  }
})();