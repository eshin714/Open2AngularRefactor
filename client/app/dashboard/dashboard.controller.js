(function() {
  'use strict';

  angular
    .module('open.dashboard')
    .controller('DashboardController', DashboardController);

  function DashboardController(auth, dashboard, $localStorage, $mdSidenav) {

    var vm = this;

    vm.populateFriendsEvents = populateFriendsEvents;
    vm.openNav = openNav;
    vm.leftNav = "left"

    function populateFriendsEvents() {
      var userObj = {};
      userObj.id = $localStorage.userdata.id;

      dashboard.getFriendsEvents(userObj)
        .then(function(data) {
          console.log("Friend data from dashboard",data)
          vm.friendsList = data.data[0];
          vm.eventsList = data.data[1];
        });
    };

    function openNav() {
      $mdSidenav('left')
        .toggle()
          .then(function(){
            console.log("sidenav opened")
          });
    }

  }
})();