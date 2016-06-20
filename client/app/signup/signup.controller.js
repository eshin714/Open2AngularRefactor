(function() {
  'use strict';

  angular
    .module('open.signup')
    .controller('SignupController', SignupController);

  function SignupController(auth, $state) {

    var vm = this;

    vm.submit = submit;

    function submit(username, email, password, passwordConfirm) {
      var errors = [];

      if(validatePassword(password, passwordConfirm, email)) {
        var userObj = {
        username: username,
        email: email,
        password: password
        };
        auth.signup(userObj)
          .then(function(data) {
            if(data.data === "success") {
              console.log("success", data);
              $state.go('login');
            } else if(data.data === "error") {
              console.log("error", data)
              vm.errors = "Username Exists!"
            }
          });
      } else {
        console.log("error")
      }
    }

    function validatePassword(password, passwordConfirm, email) {
      var p = password;
      var errors = [];

      if(!validateEmail(email)) {
        errors.push("Email is not a real email.")
      }
      if(!(p === passwordConfirm)) {
        errors.push("Password does not match.");
      }
      if(p.length < 8) {
        errors.push("Your password must be at least 8 characters.");
      }
      if(p.search(/[a-z]/i) < 0) {
        errors.push("Your password must contain at least one letter.");
      }
      if(p.search(/[0-9]/) < 0) {
        errors.push("Your password must contain at least one digit.");
      }
      if(errors.length > 0) {
        vm.errors = errors;
        return false;
      }
      return true;
    }

    function validateEmail(email) {
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }



  }
})()