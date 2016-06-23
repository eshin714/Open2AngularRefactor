(function() {
  'use strict';

  angular
    .module('open')
    .factory('dashboard', dashboard);

  function dashboard($http, $state, $localStorage) {
    var service = {
      getFriendsEvents: getFriendsEvents,
    };
    return service;

    function getFriendsEvents(userObj) {
      return $http.post('/dashboard', userObj)
        .then(function(data) {
          return data.data;
        })
    }

  }
})();