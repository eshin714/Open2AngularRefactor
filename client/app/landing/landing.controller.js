(function() {
  'use strict';

  angular
    .module('open.landing')
    .controller('LandingController', LandingController);

  function LandingController($mdDialog, $mdMedia, $state, auth) {

    var vm = this;

    vm.openLogin = openLogin;
    vm.openSignup = openSignup;

    function openLogin(ev) {

      auth.tokenCheck()
        .then(function(data) {
          if(data.success) {
            console.log("already Logged in, routing to dashboard");
            $state.go('dashboard');
          } else {
            $mdDialog.show({
              targetEvent: ev,
              templateUrl: 'app/login/login.html',
              controller: 'LoginController as login',
              clickOutsideToClose:true
            });
          }
        })
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