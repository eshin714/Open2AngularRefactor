var express = require('express');
var router = express.Router();
var db = require('../db.js');

router.post('/', function(req, res) {
  console.log(req.body)
  var userId = req.body.id;
  db.query('SELECT username, user_id, friend_id, accept FROM Friends, Users WHERE user_id = ' + userId + '  AND Users.id = Friends.friend_id; SELECT Events.event_name, Events.user_id, Events.friend_id, Events.accept FROM `Events` WHERE Events.friend_id = ' + userId + ' OR Events.user_id = ' + userId + ';',
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
      } else {
        console.log('success', results)
        res.json({
          succes: true,
          data: results
        })
      }
    })
})

router.post('/request', function(req, res) {
  console.log('friend obj', req.body)
  var friendObj = req.body;

  db.query('SELECT * FROM Friends WHERE user_id = '+ friendObj.userId +' AND friend_id = ' + friendObj.friendId +';', function(err, results) {
    if(results.length === 0) {
      db.query('INSERT INTO Friends (`user_id`, `friend_id`) VALUES ('+friendObj.userId +','+friendObj.friendId+')',
        function (err, results, fields) {
          if (err) {
            throw err;
          } else {
            console.log('success', results, fields);
            res.json({
              message: "Friend Request Sent!"
            })
          }
      });
    } else {
      console.log("Friends Connection", results)
      res.send({
        message: "Fail. Username already exists."
      });
    }
  });
})
//add friend

router.post('/acceptFriend', function(req, res) {
  var userObj = req.body;
  db.query('UPDATE Friends SET Friends.accept = 1 WHERE Friends.user_id = '+ userObj.userId +' AND Friends.friend_id = '+ userObj.friendId+';',
  function(err, results) {
    if(err) {
      console.log(err)
    } else {
      console.log("success", results)
    }
  });
})



//add event

// router.post('/acceptEvent', function(req, res) {
//   var userObj = req.body;
//   db.query('UPDATE `Events` SET Events.accept = 1 WHERE Events.user_id = '+ userObj.userId +' AND Friends.friend_id = '+ userObj.friendId+';',
//   function(err, results) {
//     if(err) {
//       console.log(err)
//     } else {
//       console.log("success", results)
//     }
//   });
// })


//create events

router.post('/createEvent', function(req, res) {
  var eventObj = req.body;





})
  // db.query('SELECT Events.event_name, Events.user_id, Events.friend_id, Events.accept, Users.username FROM `Events`, Users WHERE Events.friend_id = Users.id AND Events.user_id = 1;', function(err, results) {
  //   if(err) {
  //     console.log(err)
  //   } else {
  //     console.log("success", results)
  //     // res.json({
  //     //   success: true,
  //     //   friendsObj: results
  //     // })
  //   }
  // });

module.exports = router;