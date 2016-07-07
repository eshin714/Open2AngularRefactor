var express = require('express');
var router = express.Router();
var db = require('../db.js');

router.post('/', function(req, res) {
  console.log(req.body)
  var userId = req.body.id;
  db.query('SELECT Users.username, Friends.user_id, Friends.friend_id, Friends.accept FROM Friends INNER JOIN Users ON Friends.friend_id = Users.id WHERE Friends.user_id = '+ userId +';                                         SELECT Users.username, Friends.user_id, Friends.friend_id, Friends.accept FROM Friends INNER JOIN Users ON Friends.User_id = Users.id WHERE Friends.friend_id = '+ userId +'; SELECT Events.event',
    function(err, results) {
      if(err) {
        console.log(err)
      } else {
        console.log("success", results)
        res.json({
          success: true,
          data: results
        })
      }
    });
})

router.post('/search', function(req, res) {
  console.log('friend obj', req.body)
  var friendName = req.body.username;
  db.query('SELECT * FROM Users WHERE username = ?', [friendName], function(err, results) {
      if(err) {
        console.log('no user found', err)
        res.json({
        success: false,
        message: "No User Found",
        data: results
        })
      } else {
        console.log('success', results)
        res.json({
          success: true,
          message: "User Found",
          data: results
        })
      }
    })
})

router.post('/request', function(req, res) {
  console.log('friend obj', req.body)
  var friendObj = req.body;

  db.query('SELECT * FROM Friends WHERE (user_id = '+ friendObj.userId +' AND friend_id = ' + friendObj.friendId +') OR (user_id = '+ friendObj.friendId +' AND friend_id = ' + friendObj.userId +');', function(err, results) {
    if(results.length === 0) {
      db.query('INSERT INTO Friends (`user_id`, `friend_id`) VALUES ('+friendObj.userId +','+friendObj.friendId+')',
        function (err, results, fields) {
          if (err) {
            throw err;
          } else {
            console.log('success', results, fields);
            res.json({
              success: true,
              message: "Friend Request Sent!",
              data: results
            })
          }
      });
    } else {
      console.log("Friends Connection", results)
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



//add event

router.post('/acceptEvent', function(req, res) {
  var eventObj = req.body;
  db.query('UPDATE `EventUsers` SET EventsUsers.accept = 1 WHERE Events.id = '+ eventObj.eventId +' AND Events.friend_id = '+ eventObj.userId +';',
  function(err, results) {
    if(err) {
      res.json({
        success: false,
        message: "Event accept Failed."
      })
    } else {
      res.json({
        success: true,
        message: "Event accepted!",
        data: results
      })
    }
  });
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
        var values = [];
        var friendData = eventObj.friendsObj;

        for(var i = 0; i < friends.length;i++) {
          values.push([results.insertId, friendData[i].friend_id, 0])
        }

        db.query('INSERT INTO `EventUsers` (`event_id`, `user_id`, `accept`) VALUES ?', [values],
          function(err, results) {
            if(err) {
              res.json({
                success: false,
                message: "Adding Users to Event failed."
              })
            } else {
              res.json({
                success: true,
                message: "Added Friends to Events!",
                data: results
              })
            }
          }
        )
      }
    }
  )
})






module.exports = router;