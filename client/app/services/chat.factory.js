(function() {
  'use strict';

  angular
    .module('open')
    .factory('chat', chat);

  function chat($http, $rootScope, $window, socket) {

    var service = {
      openChat: openChat,
      addMsg: addMsg,
      on: on,
      emit: emit,
      // enterEvent: enterEvent
    };
    return service;

  function openChat(eventObj) {
    on('enterEvent', function(data) {
      return data
    })
  }

  function addMsg(msgObj) {
    return $http.post('/chat/addMsg', msgObj)
      .then(function(data) {
        return data.data;
      })
  }



function on(eventName, callback) {
  // var socket = io.connect();
  socket.on(eventName, function() {
    var args = arguments;
    $rootScope.$applyAsync(function() {
      callback.apply(socket, args);
    });
  });
}

function emit(eventName, data, callback) {
  // var socket = io.connect();
  socket.emit(eventName, data, function() {
    var args = arguments;
    $rootScope.$applyAsync(function() {
      if (callback) {
        callback.apply(socket, args);
      }
    });
  });
  // socket.on('sentMsg', function(data) {
  //   console.log("sent",data);
  // })
}



  // function enterEvent(eventObj) {
  //   var socket = io.connect();
  //   socket.emit('enterEvent', eventObj);
  // }


  }
})();
