(function() {
  'use strict';

  angular
    .module('open.login')
    .controller('LoginController', LoginController);

  function LoginController(auth, $http, $state) {

    var vm = this;

    vm.submit = submit;

    function submit(username, password) {
      var userObj = {};
      userObj.username = username;
      userObj.password = password;
      auth.login(userObj)
        .then(function(data) {
          console.log(data);
          if(data.success) {
            vm.alert = data.message;
            $state.go('dashboard')
          } else {
            vm.alert = data.message;
          }
        })

    }

  }
})();