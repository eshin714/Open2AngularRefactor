(function() {
  'use strict';

  angular
    .module('appName')
    .run(run);

  function run($state) {
    $state.go('main');
  }
})();

//The first thing our app does. It will run this and head to the 'main page'