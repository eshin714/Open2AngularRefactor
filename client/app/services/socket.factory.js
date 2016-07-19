(function() {
  'use strict';

  angular
    .module('open')
    .factory('socket', socket);

  function socket(socketFactory) {
    return socketFactory();
  }
})();
