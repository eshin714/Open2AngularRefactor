(function() {
  'use strict';

  angular
    .module('open.dashboard')
    .controller('DashboardController', DashboardController);

  function DashboardController(auth, dashboard, $localStorage, $mdDialog, $mdMedia, chat, $scope, $q, filepickerService) {

    var vm = this;
    vm.loggedUserId = $localStorage.userdata.id;
    vm.loggedUsername = $localStorage.userdata.username;
    vm.populateFriendsEvents = populateFriendsEvents;
    vm.findFriend = findFriend;
    vm.showSearch = showSearch;
    vm.sendRequest = sendRequest;
    vm.addEvent = addEvent;
    vm.deleteEvent = deleteEvent;
    vm.addFriend = addFriend;
    vm.deleteFriend = deleteFriend;
    vm.attendEvent = attendEvent;
    vm.eventList = [];
    vm.msgList = [];
    vm.trueFriend = [];
    vm.falseFriend = [];
    vm.enterChat = enterChat;
    vm.sendMsg = sendMsg;
    vm.logout = logout;
    vm.userPhoto = $localStorage.userdata.pic;
    vm.pendingList = true;
    vm.messageInput = false;
    vm.deleteButton = false;
    vm.isActive = false;
    vm.uploadPhoto = uploadPhoto;
    vm.classSwitch = classSwitch;

    function logout() {
      auth.logout();
    }

    function populateFriendsEvents() {
      var userObj = {};
      userObj.id = vm.loggedUserId;

      dashboard.getFriendsEvents(userObj)
        .then(function(data) {
          var friendsArr = data.data[0].concat(data.data[1]);
          var events = data.data[2];
          parseEvents(events)
          parseFriends(friendsArr)
        });
    };

    function showSearch(ev, friends) {
      console.log("false friensd", friends)
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
      $mdDialog.show({
        controller: DashboardController,
        controllerAs: 'dashboard',
        templateUrl: 'app/dashboard/modalviews/dashboard.search.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: useFullScreen,
        locals: {friends: friends}
      })
      .then(function(result) {
        console.log("result out of search", result.rowData[0])
        return result.rowData[0]
      })
      .then(function(data) {
        vm.falseFriend.push(data);
      })

    };

    function findFriend(friend) {
      var friendObj = {};
      if(friend === vm.loggedUsername) {
        vm.foundFriendMsg = "Cannot search for yourself!";
      } else {
        friendObj.username = friend;
        dashboard.searchFriend(friendObj)
          .then(function(data) {
            vm.foundFriends = data.data;
            vm.foundFriendMsg = data.message;
          })
      }
    };

    function sendRequest(friendId) {
      var friendObj = {};
      friendObj.friendId = friendId;
      friendObj.userId = vm.loggedUserId;
      dashboard.requestFriend(friendObj)
        .then(function(data) {
          vm.foundFriendMsg = data.message;
          $mdDialog.hide(data)
        })
    };

    function addFriend(friendId, userId) {
      var friendObj = {};
      friendObj.userId = userId;
      friendObj.friendId = friendId;
      dashboard.acceptFriend(friendObj)
        .then(function(data) {
          vm.falseFriend.forEach(function(obj, index) {
            if(obj.friend_id === friendId && obj.user_id === userId) {
              vm.falseFriend.splice(index, 1);
              vm.trueFriend.push({
                accept : 1,
                friend_id : obj.friend_id,
                pic : obj.pic,
                user_id :  obj.user_id,
                username: obj.username
              })
            } else if (obj.friend_id === userId && obj.user_id === friendId) {
              vm.falseFriend.splice(index, 1);
              vm.trueFriend.push({
                accept : 1,
                friend_id : obj.friend_id,
                pic : obj.pic,
                user_id :  obj.user_id,
                username: obj.username
              })
            }
          })
        })
    };

    function deleteFriend(userId, friendId, ev) {

      var confirm = $mdDialog.confirm()
          .title('Are you sure you want to Unfriend?')
          .targetEvent(ev)
          .ok('Un-Friend')
          .cancel('Cancel');

        $mdDialog.show(confirm).then(function() {
          var friendObj = {};
          friendObj.userId = vm.loggedUserId;
            if(userId === vm.loggedUserId) {
              friendObj.friendId = friendId;
            } else {
              friendObj.friendId = userId;
            }
          console.log("delete friend...", friendObj)
          dashboard.deleteFriend(friendObj)
            .then(function(data) {
              for(var i = 0; i < vm.trueFriend.length; i++) {
                if(vm.trueFriend[i].user_id === friendObj.friendId || vm.trueFriend[i].friend_id === friendObj.friendId) {
                  vm.trueFriend.splice(i, 1)
                }
              }

              for(var i = 0; i < vm.falseFriend.length; i++) {
                if(vm.falseFriend[i].user_id === friendObj.friendId || vm.falseFriend[i].friend_id === friendObj.friendId) {
                  vm.falseFriend.splice(i, 1)
                }
              }
              vm.deleteButton = false;
              parseEvents(data[1])
            })
        }, function() {
          console.log("Canceled Friend Delete")
        });


    }

    function addEvent(event, friends) {
      var eventObj = {};
      eventObj.eventName = event;
      eventObj.userId = vm.loggedUserId;
      eventObj.friendsObj = vm.trueFriend;
      dashboard.createEvent(eventObj)
        .then(function(data) {
          parseEvents(data.data);
          vm.eventName = "";
        })
    };

    function attendEvent(userId, eventId) {
      var eventObj = {};
      eventObj.userId = userId;
      eventObj.eventId = eventId;
      dashboard.acceptEvent(eventObj)
        .then(function(data) {
          vm.eventList.forEach(function(obj, index) {
            if(obj.event_id === eventId) {
              var updateEvent = obj;
              updateEvent.username.forEach(function(userObj) {
                if(userObj.userId === userId) {
                  userObj.accept = 1;
                }
              });
              vm.eventList[index] = updateEvent;
            }
          })
        })
    };

    function deleteEvent(eventId, ev) {
      var confirm = $mdDialog.confirm()
        .title('Are you sure you want to Leave?')
        .targetEvent(ev)
        .ok('Leave Event')
        .cancel('Cancel');

      $mdDialog.show(confirm).then(function() {
        var eventObj = {};
        eventObj.userId = vm.loggedUserId;
        eventObj.eventId = eventId;
        dashboard.leaveEvent(eventObj)
          .then(function(data) {
          var indexOfEvent = vm.eventList.map(function(x) {
            return x.event_id;}).indexOf(eventId);
          vm.eventList.splice(indexOfEvent,1);
          vm.deleteButton = false;
          })
      }, function() {
        console.log("Canceled Leave Event")
      });
    }

    function enterChat(eventId, eventName) {
      var eventObj = {};
      eventObj.eventId = eventId;
      eventObj.eventName = eventName;
      eventObj.userId = vm.loggedUserId;
      request(eventObj)
        .then(function(data) {
          vm.currentEventId = eventId;
          vm.chatName = eventName;
          vm.msgList = data.data;
          vm.messageInput = true;
        })

      function request(eventObj) {
        var deferred = $q.defer();
        chat.emit('enterEvent', eventObj)
        chat.on('status', function(d) {
          deferred.resolve(d);
        });
        return deferred.promise;
      }
    };

    function sendMsg(msg) {
      var msgObj = {};
      msgObj.username = vm.loggedUsername;
      msgObj.eventId = vm.currentEventId;
      msgObj.userId = vm.loggedUserId;
      msgObj.text = msg;
      vm.msg = "";
      chat.emit("sendMsg", msgObj);

    };

    chat.on('sentMsg', function(data) {
      vm.msgList.push(data[0])
    })

    chat.on('receivedMsg', function(data) {
      vm.msgList.push(data[0])
    })

    function uploadPhoto() {
      filepickerService.pick({mimetype: 'image/*'}, function(Blob) {
        var userObj = {};
        userObj.profileImg = Blob.url;
        userObj.userId = vm.loggedUserId;
        dashboard.imageUrl(userObj)
        .then(function(data) {
          $localStorage.userdata.pic = ""+data.data[0].pic;
          vm.userPhoto = ""+data.data[0].pic;
        });
      });
    }

    function classSwitch() {
      vm.isActive = !vm.isActive;
    }

    function parseEvents(events) {
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
                  accept: value.accept,
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
      vm.eventList = vm.eventList.concat(eventOutput);

    }

    function parseFriends(friendsArr) {
      friendsArr.filter(function(obj) {
        if(obj.accept === 1) {
          vm.trueFriend.push(obj)
        } else {
          vm.falseFriend.push(obj)
        }
      });
    }
  }
})();