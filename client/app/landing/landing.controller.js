(function() {
  'use strict';

  angular
    .module('open.landing')
    .controller('LandingController', LandingController);

  function LandingController($mdDialog, $mdMedia) {

    var vm = this;

    vm.openLogin = openLogin;
    vm.openSignup = openSignup;

    function openLogin(ev) {
      $mdDialog.show({
         targetEvent: ev,
         templateUrl: 'app/login/login.html',
         controller: 'LoginController as login',
         clickOutsideToClose:true
      });
    };

    function openSignup(ev) {
      $mdDialog.show({
         targetEvent: ev,
         templateUrl: 'app/signup/signup.html',
         controller: 'SignupController as signup',
         clickOutsideToClose:true
      });
    };

  }
})();