(function() {
  'use strict';

  angular
    .module('open')
    .run(run);

  function run($state) {
    $state.go('login');
  }
})();

//The first thing our app does. It will run this and head to the 'main page'