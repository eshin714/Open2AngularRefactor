(function() {
  'use strict';

  angular
    .module('open.dashboard')
    .controller('DashboardController', DashboardController);

  function DashboardController(auth, dashboard, $localStorage, $mdSidenav, $mdDialog, $mdMedia, $scope) {

    var vm = this;

    vm.populateFriendsEvents = populateFriendsEvents;
    vm.openNav = openNav;
    vm.findFriend = findFriend;
    vm.showSearch = showSearch;

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
    };

    function findFriend(friend) {

      var friendObj = {};
      friendObj.username = friend;
      console.log("finding friend",friendObj)
      dashboard.searchFriend(friendObj)
        .then(function(data) {
          console.log(data);
          vm.foundFriends = data.data;
          console.log('found friends', vm.foundFriends)
        })
    }

    function showSearch(ev) {
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
      $mdDialog.show({
        controller: DashboardController,
        controllerAs: 'dashboard',
        templateUrl: 'app/dashboard/dashboard.search.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: useFullScreen
      })
    };








  }
})();