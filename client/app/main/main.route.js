(function() {
  'use strict';

  angular
    .module('appName.main')
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/main',
        views: {
          '': {
            templateUrl: 'app/main/main.html',
            controller: 'MainController as main'
          }
        }
      });
  }
})()