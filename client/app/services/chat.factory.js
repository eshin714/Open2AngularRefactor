(function() {
  'use strict';

  angular
    .module('open')
    .factory('chat', chat);

  function chat($http, $rootScope, socket) {

    var service = {
      on: on,
      emit: emit
    };
    return service;

    function on(eventName, callback) {
      socket.on(eventName, function() {
        var args = arguments;
        $rootScope.$applyAsync(function() {
          callback.apply(socket, args);
        });
      });
    }

    function emit(eventName, data, callback) {
      socket.emit(eventName, data, function() {
        var args = arguments;
        $rootScope.$applyAsync(function() {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    }

  }
})();
