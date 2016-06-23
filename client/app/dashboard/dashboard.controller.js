(function() {
  'use strict';

  angular
    .module('open.dashboard')
    .controller('DashboardController', DashboardController);

  function DashboardController(auth, dashboard, $localStorage) {

    var vm = this;

    vm.populateFriendsEvents = populateFriendsEvents;

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

  }
})();