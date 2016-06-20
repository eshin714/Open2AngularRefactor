(function() {
  'use strict';

  angular
    .module('open')
    .factory('auth', auth);

  function auth($http, $state) {
    var service = {
      signup: signup,
      login: login
    };
    return service;

    function signup(userObj) {
      return $http.post('/auth',userObj)
    }

    function login(userObj) {
      return $http.post('/auth/login',userObj)
    }
  }
})();