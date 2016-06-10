(function() {
  'use strict';

  angular
    .module('open.signup')
    .controller('SignupController', SignupController);

  function SignupController(auth) {

    var vm = this;

    vm.submit = submit;

    function submit(username, email, password) {
      var userObj = {
        username: username,
        email: email,
        password: password
      };
      console.log("submitted");
      auth.signup(userObj)
        // .then(function(data) {
        //   console.log('Data Fields Applied', data);
        // });


    }

  }
})()