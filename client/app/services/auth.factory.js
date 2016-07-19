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
      tokenCheck: tokenCheck,
      logout: logout
    };
    return service;

    function tokenCheck() {
      // if($localStorage.userdata) {
      //   $http.defaults.headers.common.username = $localStorage.userdata.username;
      //   $http.defaults.headers.common.token = $localStorage.userdata.token;
      // }
      return $http.get('/auth')
        .then(function(data) {
          var auth = data.data;
          console.log("data from token check in factory", auth)
          if(auth.success) {
            console.log(auth.message);
            return auth;
          } else {
            console.log(auth.message);
            // $state.go('landing')
            return auth;
          }
        })
    }

    function current() {
      if($localStorage.userdata) {
        return {
          username: $localStorage.userdata.username,
          token: $localStorage.userdata.token
        }
      }
    }

    function signup(userObj) {
      return $http.post('/auth',userObj)
    }

    function login(userObj) {
      return $http.post('/auth/login',userObj)
        .then(function(data) {
          console.log("login data", data)
          console.log("This is data.success", data.data.success)
          if(data.data.success) {
            var dataObj = data.data.userdata;
            $localStorage.userdata = dataObj;
            $http.defaults.headers.common.username = dataObj.username;
            $http.defaults.headers.common.token = dataObj.token;
            return data.data;
          } else {
            console.log(data.data.success)
            console.log(data.data.message)
            return data.data;
          }
        })
    }

    function logout() {
      $http.defaults.headers.common = {Accept: "application/json, text/plain, */*"};
      $localStorage.$reset();
      $state.go('landing');
    }
  }
})();