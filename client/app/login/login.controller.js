(function() {
  'use strict';

  angular
    .module('open.login')
    .controller('LoginController', LoginController);

  function LoginController(auth) {

    var vm = this;

    vm.submit = submit;

    function submit(username, password) {
      var userObj = {};
      userObj.username = username;
      userObj.password = password;

      auth.login(userObj)
        .then(function(data) {
          vm.alert = data.data;
        })
    }

  }
})()