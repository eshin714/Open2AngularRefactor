(function() {
  'use strict';

  angular
    .module('open')
    .run(run);

  function run($state, $http, auth, $rootScope, $localStorage) {
    if (auth.current().token) {
      $http.defaults.headers.common.username = auth.current().username;
      $http.defaults.headers.common.token = auth.current().token;
    }

    $rootScope.$on('$stateChangeStart', function(event, toState) {
      auth.tokenCheck();
    })
  }
})();