(function() {
  'use strict';

  angular
    .module('open', [
      'ui.router',
      'ngStorage',
      'open.login',
      'open.signup',
      'open.dashboard'
    ]);
})();