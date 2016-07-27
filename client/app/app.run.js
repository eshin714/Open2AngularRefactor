(function() {
  'use strict';

  angular
    .module('open')
    .run(run);

  function run($state, $http, auth, $rootScope, $localStorage) {
    if (auth.current()) {
      $http.defaults.headers.common.username = $localStorage.userdata.username;
      $http.defaults.headers.common.token = $localStorage.userdata.token;
    }

    $rootScope.$on('$stateChangeStart', function(event, toState) {
      var requiredLogin = toState.data.requiredLogin;

      if(requiredLogin && auth.current() === undefined) {
        event.preventDefault();
        $state.go('landing');
      }
    })
  }
})();