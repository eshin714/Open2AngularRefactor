(function() {
  'use strict';

  angular
    .module('open')
    .factory('chat', chat);

  function chat($http) {
    var service = {
      openChat: openChat,
      addMsg: addMsg
    };
    return service;


  function openChat(eventObj) {
    return $http.post('/chat', eventObj)
      .then(function(data) {
        return data.data;
      })
  }

  function addMsg(msgObj) {
    return $http.post('/chat/addMsg', msgObj)
      .then(function(data) {
        return data.data;
      })
  }

  }
})();