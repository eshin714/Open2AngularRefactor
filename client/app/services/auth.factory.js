(function() {
  'use strict';

  angular
    .module('open')
    .factory('auth', auth);

  function auth($http) {
    var service = {
      signup: signup,
    };
    return service;

    function signup(userObj) {
      $http.post('/auth',userObj)
    }
  }
})();