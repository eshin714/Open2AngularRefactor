(function() {
  'use strict';

  angular
    .module('open.landing')
    .controller('LandingController', LandingController);

  function LandingController($mdDialog, $mdMedia) {

    var vm = this;

    vm.openOffscreen = openOffscreen;

    function openOffscreen(ev) {
      $mdDialog.show({
         targetEvent: ev,
         templateUrl: 'app/login/login.html',
         controller: 'LoginController as login',
         clickOutsideToClose:true
      });
    };


  }
})();