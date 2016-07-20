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
      createEvent: createEvent,
      acceptFriend: acceptFriend,
      acceptEvent: acceptEvent,
      imageUrl: imageUrl
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
      return $http.post('/dashboard/createEvent', eventObj)
        .then(function(data) {
          return data.data;
        });
    };

    function acceptFriend(friendObj) {
      return $http.post('/dashboard/acceptFriend', friendObj)
        .then(function(data) {
          return data.data;
        });
    };

    function acceptEvent(eventObj) {
      return $http.post('/dashboard/acceptEvent', eventObj)
        .then(function(data) {
          return data.data;
        });
    };

    function imageUrl(userObj) {
      return $http.post('/dashboard/image', userObj)
        .then(function(data) {
          return data.data;
        })
    };

  }
})();