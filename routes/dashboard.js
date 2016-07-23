var express = require('express');
var router = express.Router();
var db = require('../db.js');

router.post('/', function(req, res) {
  var userId = req.body.id;
  db.query('SELECT Users.username, Users.pic, Friends.user_id, Friends.friend_id, Friends.accept FROM Friends INNER JOIN Users ON Friends.friend_id = Users.id WHERE Friends.user_id = '+ userId +';                           SELECT Users.username, Users.pic, Friends.user_id, Friends.friend_id, Friends.accept FROM Friends INNER JOIN Users ON Friends.User_id = Users.id WHERE Friends.friend_id = '+ userId +'; SELECT EventUsers.event_id, Events.event_name, Events.event_creator, Events.date_created, EventUsers.accept, EventUsers.user_id, Users.username FROM Events INNER JOIN EventUsers ON Events.id = EventUsers.event_id INNER JOIN Users ON EventUsers.user_id = Users.id WHERE Events.id = ANY (SELECT EventUsers.event_id FROM EventUsers WHERE EventUsers.user_id = '+ userId +');',
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
  db.query('SELECT * FROM Friends WHERE (user_id = '+ friendObj.userId +' AND friend_id = ' + friendObj.friendId +') OR (user_id = '+ friendObj.friendId +' AND friend_id = ' + friendObj.userId +');', function(err, results) {
    if(results.length === 0) {
      db.query('INSERT INTO Friends (`user_id`, `friend_id`) VALUES ('+friendObj.userId +','+friendObj.friendId+')',
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
  db.query('UPDATE Friends SET Friends.accept = 1 WHERE Friends.user_id = '+ userObj.friendId +' AND Friends.friend_id = '+ userObj.userId+';',
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
  db.query('DELETE FROM Friends WHERE (Friends.user_id = '+userObj.userId+' AND Friends.friend_id = '+userObj.friendId+') OR (Friends.user_id = '+userObj.friendId+' AND Friends.friend_id = '+userObj.userId+');',
    function(err, results) {
      if(err) {
        console.log("Error SQL", err)
        res.json({
          success: false,
          message: "Delete friend failed."
        })
      } else {
        db.query('DELETE FROM `EventUsers` WHERE EventUsers.user_id = '+userObj.userId+' AND EventUsers.event_id = ANY (SELECT Events.id FROM `Events` WHERE Events.event_creator = '+userObj.friendId+');',
          function(err, results1) {
            if(err) {
        console.log("Error SQL", err)
              res.json({
                success: false,
                message: "Event Deleted Failed."
              })
            } else {
              res.json({
                success: true,
                message: "Friend and Events Deleted"
              })
            }
          })
      }
    })
})

//add event

router.post('/acceptEvent', function(req, res) {
  var eventObj = req.body;
  db.query('UPDATE `EventUsers` SET EventUsers.accept = 1 WHERE EventUsers.event_id = '+ eventObj.eventId +' AND EventUsers.user_id = '+ eventObj.userId +';',
  function(err, results) {
    if(err) {
      console.log(err);
      res.json({
        success: false,
        message: "Event accept Failed."
      })
    } else {
      db.query('INSERT INTO `Chats` (`event_id`, `user_id`, `text`, timestamp) VALUES ('+eventObj.eventId+', '+eventObj.userId+', "has joined the chat.", NOW());',
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
  var eventObj = req.body;
  db.query('DELETE FROM `EventUsers` WHERE EventUsers.event_id = '+eventObj.eventId+' AND EventUsers.user_id = '+eventObj.userId+';',
  function(err, results) {
    if(err) {
      console.log(err);
      res.json({
        success: false,
        message: "Event Leave Failed."
      })
    } else {
      res.json({
        success: true,
        message: "Leave Event Success."
      })
    }
  })
})

//create events

router.post('/createEvent', function(req, res) {
  var eventObj = req.body;
  var friends = eventObj.friendsObj;
  db.query('INSERT INTO `Events` (`id`, `event_name`, `event_creator`, `date_created`) VALUES (NULL, "'+eventObj.eventName+'", '+eventObj.userId+', NOW());',
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
              db.query('INSERT INTO `Chats` (`event_id`, `user_id`, `text`, timestamp) VALUES ('+results.insertId+', '+eventObj.userId+', "has created an event", NOW());',
                function(err, results3) {
                  if(err) {
                    console.log(err);
                    res.json({
                      success: false,
                      message: "Chat create failed"
                    })
                  } else {
                    db.query('SELECT EventUsers.event_id, Events.event_name, Events.event_creator, Events.date_created, EventUsers.accept, EventUsers.user_id, Users.username FROM `Events` INNER JOIN EventUsers ON Events.id = EventUsers.event_id INNER JOIN Users ON EventUsers.user_id = Users.id WHERE Events.id = '+results.insertId+';',
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
  db.query('UPDATE `Users` SET Users.pic ="'+userObj.profileImg+'" WHERE Users.id ='+userObj.userId+';',
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
        db.query('SELECT Users.pic FROM `Users` WHERE Users.id ='+ userObj.userId +';',
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

// function returnFriendRow(results, success, results1) {
//   db.query('SELECT * FROM `Users` WHERE Users.id = '+ results.insertId +';',
//   function(err, results1) {
//     if(err) {
//       console.log("error ", err);
//       res.json({
//         success: false,
//         message: "Row return failed."
//       });
//     } else {
//       res.json(success)
//     }
//   })
// }


module.exports = router;