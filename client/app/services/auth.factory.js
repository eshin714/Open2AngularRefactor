(function() {
  'use strict';

  angular
    .module('open')
    .factory('auth', auth);

  function auth($http, $state, $localStorage) {
    var service = {
      signup: signup,
      login: login,
      current: current,
      tokenCheck: tokenCheck
    };
    return service;

    function tokenCheck() {
      return $http.get('/auth')
        .then(function(data) {
          var auth = data.data;
          if(auth.success) {
            console.log(auth.message);
            return auth.success
          } else {
            console.log(auth.message);
            $state.go('login')
          }
        })
    }

    function current() {
      return {
        username: $localStorage.userdata.username,
        token: $localStorage.userdata.token
      };
    }

    function signup(userObj) {
      return $http.post('/auth',userObj)
    }

    function login(userObj) {
      return $http.post('/auth/login',userObj)
        .then(function(data) {
          var dataObj = data.data.userdata;
          $localStorage.userdata = dataObj;
          $http.defaults.headers.common.username = dataObj.username;
          $http.defaults.headers.common.token = dataObj.token;
          return data.data;
        })
    }
  }
})();