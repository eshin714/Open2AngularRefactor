var express = require('express');
var router = express.Router();
var db = require('../db.js');

router.post('/', function(req, res) {
  var userId = req.body.id;
  db.query('SELECT Users.username, Users.pic, Friends.user_id, Friends.friend_id, Friends.accept FROM Friends INNER JOIN Users ON Friends.friend_id = Users.id WHERE Friends.user_id = ?;                           SELECT Users.username, Users.pic, Friends.user_id, Friends.friend_id, Friends.accept FROM Friends INNER JOIN Users ON Friends.User_id = Users.id WHERE Friends.friend_id = ?; SELECT EventUsers.event_id, Events.event_name, Events.event_creator, Events.date_created, EventUsers.accept, EventUsers.user_id, Users.username FROM Events INNER JOIN EventUsers ON Events.id = EventUsers.event_id INNER JOIN Users ON EventUsers.user_id = Users.id WHERE Events.id = ANY (SELECT EventUsers.event_id FROM EventUsers WHERE EventUsers.user_id = ?);', [[userId],[userId],[userId]],
      function(err, results) {
      if(err) {
        console.log(err)
      } else {
        res.json({
          success: true,
          data: results
        })
      }
    });
})

router.post('/search', function(req, res) {
  var friendName = req.body.username;
  db.query('SELECT * FROM Users WHERE username = ?', [friendName], function(err, results) {
      if(results.length === 0) {
        res.json({
        success: false,
        message: "No User Found.",
        })
      } else {
        res.json({
          success: true,
          message: "User Found",
          data: results
        })
      }
    })
})

router.post('/request', function(req, res) {
  var friendObj = req.body;
  db.query('SELECT * FROM Friends WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?);',[friendObj.userId, friendObj.friendId, friendObj.friendId, friendObj.userId], function(err, results) {
    if(results.length === 0) {
      db.query('INSERT INTO Friends (`user_id`, `friend_id`) VALUES (?, ?)', [friendObj.userId, friendObj.friendId],
        function (err, results1, fields) {
          if (err) {
            throw err;
          } else {
            db.query('SELECT Users.username, Users.pic, Friends.user_id, Friends.friend_id, Friends.accept FROM Friends INNER JOIN Users ON Friends.friend_id = Users.id WHERE Friends.friend_id = '+ friendObj.friendId +' AND Friends.user_id ='+friendObj.userId+';',
            function(err, results2) {
              if(err) {
                console.log("error ", err);
                res.json({
                  success: false,
                  message: "Row return failed."
                });
              } else {
                res.json({
                success: true,
                message: "Friend Request Sent!",
                data: results1,
                rowData: results2
                })
              }
            })
          }
      });
    } else {
      res.json({
        success: false,
        message: "Already your friend.",
        data: results
      });
    }
  });
})
//add friend

router.post('/acceptFriend', function(req, res) {
  var userObj = req.body;
  db.query('UPDATE Friends SET Friends.accept = 1 WHERE Friends.user_id = ? AND Friends.friend_id = ?;', [userObj.friendId, userObj.userId],
    function(err, results, fields) {
      console.log("affected rows", results.insertId)
      if(err) {
        res.json({
          success: false,
          message: "Accept friend failed."
        })
      } else {
        res.json({
          success: true,
          message: "Friend accepted!",
          data: results
        })
      }
    });
})

router.post('/deleteFriend', function(req, res) {
  var userObj = req.body;
  console.log("This is userObj",userObj)
  db.query('DELETE FROM Friends WHERE (Friends.user_id = ? AND Friends.friend_id = ?) OR (Friends.user_id = ? AND Friends.friend_id = ?);',       [userObj.userId, userObj.friendId, userObj.friendId, userObj.userId],
    function(err, results) {
      if(err) {
        console.log("Error SQL", err)
        res.json({
          success: false,
          message: "Delete friend failed."
        })
      } else {
        console.log("Deleted Friends Success.")
        var eventObj = req.body;
        db.query('DELETE FROM `EventUsers` WHERE EventUsers.user_id = ? AND EventUsers.event_id = ANY(SELECT Events.id FROM `Events` WHERE Events.event_creator = ?);SELECT EventUsers.event_id, Events.event_name, Events.event_creator, Events.date_created, EventUsers.accept, EventUsers.user_id, Users.username FROM Events INNER JOIN EventUsers ON Events.id = EventUsers.event_id INNER JOIN Users ON EventUsers.user_id = Users.id WHERE Events.id = ANY (SELECT EventUsers.event_id FROM EventUsers WHERE EventUsers.user_id = ?);',[[userObj.userId, userObj.friendId],[userObj.userId]],
        function(err, results1) {
          if(err) {
            console.log(err);
            res.json({
              success: false,
              message: "Delete Event Failed."
            })
          } else {
            res.json({
              success: true,
              data: results1,
              message: "Deleted friend and friend created events"
            })
          }
        })
      }
    })
})

//add event

router.post('/acceptEvent', function(req, res) {
  var eventObj = req.body;
  db.query('UPDATE `EventUsers` SET EventUsers.accept = 1 WHERE EventUsers.event_id = ? AND EventUsers.user_id = ?;', [eventObj.eventId, eventObj.userId],
  function(err, results) {
    if(err) {
      console.log(err);
      res.json({
        success: false,
        message: "Event accept Failed."
      })
    } else {
      db.query('INSERT INTO `Chats` (`event_id`, `user_id`, `text`, timestamp) VALUES (?, ?, "has joined the chat.", NOW());',
        [eventObj.eventId, eventObj.userId],
        function(err, results2) {
          if(err) {
            console.log(err);
            res.json({
              success: false,
              message: "Chat create failed"
            })
          } else {
            res.json({
              success: true,
              message: "Added Friends to Events and Entered Chat!",
              eventData: results,
              chatData: results2
            });
          }
      })
    }
  });
})

router.post('/leaveEvent', function(req, res) {
  console.log("Deleted Friends Success.")
  var eventObj = req.body;
  db.query('DELETE FROM `EventUsers` WHERE EventUsers.event_id = ? AND EventUsers.user_id = ?;',[eventObj.eventId, eventObj.userId],
  function(err, results) {
    if(err) {
      console.log(err);
      res.json({
        success: false,
        message: "Event Leave Failed."
      })
    } else {
      console.log("Deleted all EventsUsers from Event Users");
      db.query('SELECT * FROM `EventUsers` WHERE EventUsers.event_id = ?;', [eventObj.eventId],
        function(err, results) {
          if(err) {
            console.log(err);
            res.json({
              success: false,
              message: "Event Leave Failed."
            })
          } else if (results.length === 0) {
          console.log("Selecting all from Event Users and There are no more users in that Event", results)
          db.query('DELETE FROM `Chats` WHERE Chats.event_id = ?; DELETE FROM `Events` WHERE Events.id = ?;', [[eventObj.eventId], [eventObj.eventId]], function(err, results) {
            if(err) {
              console.log(err);
              res.json({
                success: false,
                message: "Event delete failed",
              })
            } else {
              console.log("Deleted all chat files from Chats.Event_id and Deleted Events from Where Events Id has not matches.")
              res.json({
                success: true,
                message: "Last person left Event. Deleting Event."
              })
            }
          })
        } else {
          console.log("Left EVent. People still in event.")
          res.json({
            success: true,
            message: "Left Event. People still in event."
          })
        }
      })
    }
  })
})

//create events

router.post('/createEvent', function(req, res) {
  var eventObj = req.body;
  var friends = eventObj.friendsObj;
  db.query('INSERT INTO `Events` (`id`, `event_name`, `event_creator`, `date_created`) VALUES (NULL, ?, ?, NOW());', [eventObj.eventName, eventObj.userId],
    function(err, results) {
      if(err) {
        res.json({
          success: false,
          message: "Create Event Failed."
        })
      } else {
        var values = [[results.insertId, eventObj.userId, 1]];
        var friendData = eventObj.friendsObj;

        for(var i = 0; i < friends.length;i++) {
          if(friendData[i].friend_id !== eventObj.userId) {
            values.push([results.insertId, friendData[i].friend_id, 0])
          } else {
            values.push([results.insertId, friendData[i].user_id, 0])
          }
        }

        db.query('INSERT INTO `EventUsers` (`event_id`, `user_id`, `accept`)  VALUES ?;', [values],
          function(err, results2) {
            if(err) {
              res.json({
                success: false,
                message: "Adding Users to Event failed."
              })
            } else {
              db.query('INSERT INTO `Chats` (`event_id`, `user_id`, `text`, timestamp) VALUES (?, ?, "has created an event", NOW());',
                [results.insertId, eventObj.userId],
                function(err, results3) {
                  if(err) {
                    console.log(err);
                    res.json({
                      success: false,
                      message: "Chat create failed"
                    })
                  } else {
                    db.query('SELECT EventUsers.event_id, Events.event_name, Events.event_creator, Events.date_created, EventUsers.accept, EventUsers.user_id, Users.username FROM `Events` INNER JOIN EventUsers ON Events.id = EventUsers.event_id INNER JOIN Users ON EventUsers.user_id = Users.id WHERE Events.id = ?;', [results.insertId],
                      function(err, results4) {
                        if(err) {
                          console.log(err);
                          res.json({
                            success: false,
                            message: "event return failed"
                          })
                        } else {
                          res.json({
                            success: true,
                            message: "Added Friends to Events!",
                            data: results4
                          });
                        }
                      })

                  }
              })
            }
          }
        )
      }
    }
  )
})

//upload photo
router.post('/image', function(req, res) {
  var userObj = req.body;
  console.log(userObj)
  db.query('UPDATE `Users` SET Users.pic =? WHERE Users.id = ?;', [userObj.profileImg, userObj.userId],
    function(err, results) {
      if(err) {
        console.log("error",err)
        res.json({
          succes: false,
          message: "Upload failed."
        })
      } else {
        console.log("success1", results)
        // results.insertId
        db.query('SELECT Users.pic FROM `Users` WHERE Users.id = ?;',
          [userObj.userId],
          function(err, results1) {
            if(err) {
                      console.log("error",err)
              res.json({
                success: false,
                message: "Photo Uploaded but user not found"
              })
            } else {
                      console.log("success",results1)
              res.json({
                success: true,
                message: "Success! Returning Users row.",
                data: results1
              })
            }
          })
      }
    })
})



module.exports = router;