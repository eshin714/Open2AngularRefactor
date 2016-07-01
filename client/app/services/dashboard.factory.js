(function() {
  'use strict';

  angular
    .module('open')
    .factory('dashboard', dashboard);

  function dashboard($http, $state, $localStorage) {
    var service = {
      getFriendsEvents: getFriendsEvents,
      searchFriend: searchFriend,
      requestFriend: requestFriend,
      createEvent: createEvent
    };
    return service;

    function getFriendsEvents(userObj) {
      return $http.post('/dashboard', userObj)
        .then(function(data) {
          return data.data;
        });
    };

    function searchFriend(friendObj) {
      return $http.post('/dashboard/search', friendObj)
        .then(function(data) {
          return data.data;
        });
    };

    function requestFriend(friendObj) {
      return $http.post('/dashboard/request', friendObj)
        .then(function(data) {
          return data.data;
        });
    };

    function createEvent(eventObj) {
      return $http.post('/dashboard/createEvent')
        .then(function(data) {
          return data.data;
        });
    };

  }
})();