(function() {
  'use strict';

  angular
    .module('open.signup')
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('signup', {
        url: '/signup',
        views: {
          '': {
            templateUrl: 'app/signup/signup.html',
            controller: 'SignupController as signup'
          }
        },
        data: {
          requiredLogin: false
        }
      });
  }
})()