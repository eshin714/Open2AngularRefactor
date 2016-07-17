(function() {
  'use strict';

  angular
    .module('open')
    .factory('chat', chat);

  function chat($http, $rootScope, socketFactory) {
    var service = {
      openChat: openChat,
      addMsg: addMsg,
      on: on,
      emit: emit,
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

  function on(eventName, callback) {
    var socket = io.connect();
    socket.on(eventName, function() {
      var args = arguments;
      $rootScope.$apply(function() {
        callback.apply(socket, args);
      });
    });
  }

  function emit(){
    console.log("emitting Socket");

    var socket = io.connect();
    socket.emit('chat message', {message: "Hello World"});

  }




  }
})();