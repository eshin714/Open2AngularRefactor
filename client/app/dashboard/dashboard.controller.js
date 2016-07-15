(function() {
  'use strict';

  angular
    .module('open.dashboard')
    .controller('DashboardController', DashboardController);

  function DashboardController(auth, dashboard, $localStorage, $mdSidenav, $mdDialog, $mdMedia, $scope, chat) {

    var vm = this;

    vm.loggedUserId = $localStorage.userdata.id;
    vm.loggedUsername = $localStorage.userdata.username;
    vm.populateFriendsEvents = populateFriendsEvents;

    vm.findFriend = findFriend;
    vm.showSearch = showSearch;
    vm.sendRequest = sendRequest;
    vm.addEvent = addEvent;
    vm.addFriend = addFriend;
    vm.attendEvent = attendEvent;
    vm.trueFriend = [];
    vm.falseFriend = [];
    vm.enterChat = enterChat;
    vm.sendMsg = sendMsg;

    function populateEvents(data) {
      var events = data.data[2];
      var eventOutput = [];
      //events parser
      events.forEach(function(value) {
          var existing = eventOutput.filter(function(v, i) {
              return v.event_id === value.event_id;
          });
          if(existing.length) {
              var existingIndex = eventOutput.indexOf(existing[0]);
              eventOutput[existingIndex].username = eventOutput[existingIndex].username.concat({
                  username: value.username,
                  userId: value.user_id,
                  accept: value.accept
                });
          }
          else {
              if(typeof value.username == 'string')
                  value.username = [{
                    username: value.username,
                    userId: value.user_id,
                    accept: value.accept
                  }];
              eventOutput.push(value);
          }
      });
      eventOutput.forEach(function(value){
        if(value.event_creator === vm.loggedUserId){
          value.event_creator_name = $localStorage.userdata.username;
        } else {
          value.username.forEach(function(userObj){
            if(value.event_creator === userObj.userId) {
              value.event_creator_name = userObj.username
            }
          })
        }
      })
      vm.eventList = eventOutput;

    }

    function populateFriends(data) {
      var friendsArr = data.data[0].concat(data.data[1]);
      friendsArr.filter(function(obj) {
        if(obj.accept === 1) {
          vm.trueFriend.push(obj)
        } else {
          vm.falseFriend.push(obj)
        }
      });
    }

    function populateFriendsEvents() {
      var userObj = {};
      userObj.id = vm.loggedUserId;

      dashboard.getFriendsEvents(userObj)
        .then(function(data) {
          populateEvents(data)
          populateFriends(data)
          // vm.eventsList = data.data[2];
        });
    };

    function showSearch(ev) {
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
      $mdDialog.show({
        controller: DashboardController,
        controllerAs: 'dashboard',
        templateUrl: 'app/dashboard/modalviews/dashboard.search.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: useFullScreen
      })
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
    };

    function sendRequest(friendId) {
      var friendObj = {};
      friendObj.friendId = friendId;
      friendObj.userId = vm.loggedUserId;

      dashboard.requestFriend(friendObj)
        .then(function(data) {
          console.log("data from friend request", data)
        })
    };

    function addFriend(friendId, userId) {
      var friendObj = {};
      friendObj.userId = userId;
      friendObj.friendId = friendId;
      console.log("add friend...", friendObj)
      dashboard.acceptFriend(friendObj)
        .then(function(data) {
          console.log("Friend Accepted",data)
        })
    };

    function addEvent(event, friends) {
      var eventObj = {};
      eventObj.eventName = event;
      eventObj.userId = vm.loggedUserId;
      eventObj.friendsObj = vm.trueFriend;
      console.log("Event obj sent to add events",eventObj);
      dashboard.createEvent(eventObj)
        .then(function(data) {
          console.log("added Event Data", data);
        })
    };

    function attendEvent(userId, eventId) {
      var eventObj = {};
      eventObj.userId = userId;
      eventObj.eventId = eventId;
      console.log("attending Event", eventObj)
      dashboard.acceptEvent(eventObj)
        .then(function(data) {
          console.log("accepted Event", data)
        })
    };

    function enterChat(eventId, eventName) {
      var eventObj = {};
      eventObj.eventId = eventId;
      eventObj.userId = vm.loggedUserId;
      chat.openChat(eventObj)
        .then(function(data) {
          console.log("chat data.", data)
          vm.currentEventId = eventId;
          vm.chatName = eventName;
          vm.msgList = data.data;

        })
    };

    function sendMsg(msg) {
      var msgObj = {};
      msgObj.eventId = vm.currentEventId;
      msgObj.userId = vm.loggedUserId;
      msgObj.text = msg;

      chat.addMsg(msgObj)
        .then(function(data) {
          vm.msgList.push(data.data[0])
        })
    };


  }
})();