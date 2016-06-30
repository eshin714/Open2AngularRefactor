(function() {
  'use strict';

  angular
    .module('open', [
      'ui.router',
      'ngMaterial',
      'ng-dropdown',
      'ngStorage',
      'open.landing',
      'open.login',
      'open.signup',
      'open.dashboard'
    ]);
})();