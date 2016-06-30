(function() {
  'use strict';

  angular
    .module('open')
    .factory('dashboard', dashboard);

  function dashboard($http, $state, $localStorage) {
    var service = {
      getFriendsEvents: getFriendsEvents,
      searchFriend: searchFriend
    };
    return service;

    function getFriendsEvents(userObj) {
      return $http.post('/dashboard', userObj)
        .then(function(data) {
          return data.data;
        })
    }

    function searchFriend(friendObj) {
      return $http.post('/dashboard/search', friendObj)
        .then(function(data) {
          return data.data;
        })
    }

  }
})();