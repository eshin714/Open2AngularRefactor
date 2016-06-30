(function() {
  'use strict';

  angular
    .module('open', [
      'ui.router',
      'ngMaterial',
      'ui.bootstrap',
      'ngStorage',
      'open.landing',
      'open.login',
      'open.signup',
      'open.dashboard'
    ]);
})();