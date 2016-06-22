(function() {
  'use strict';

  angular
    .module('open.dashboard')
    .controller('DashboardController', DashboardController);

  function DashboardController(auth) {

    var vm = this;

    vm.getdata = getdata;


  }
})();