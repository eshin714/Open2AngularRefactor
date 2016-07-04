var express = require('express');
var router = express.Router();
var db = require('../db.js');

router.post('/', function(req, res) {
  console.log(req.body)
  var userId = req.body.id;
  db.query('SELECT Users.username, Friends.user_id, Friends.friend_id, Friends.accept FROM Friends INNER JOIN Users ON Friends.friend_id= Users.id WHERE Friends.user_id = '+ userId +'; SELECT Users.username, Friends.user_id, Friends.friend_id, Friends.accept FROM Friends INNER JOIN Users ON Friends.User_id = Users.id WHERE Friends.friend_id = '+ userId +'; SELECT Events.id, Events.event_name, Events.user_id, Events.friend_id, Events.accept FROM `Events` WHERE Events.friend_id = ' + userId + ' OR Events.user_id = ' + userId + ';',
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
  db.query('UPDATE Friends SET Friends.accept = 1 WHERE Friends.user_id = '+ userObj.friendId +' AND Friends.friend_id = '+ userObj.userId+';',
  function(err, results, fields) {
    if(err) {
      console.log(err)
    } else {
      console.log("success", results)
      console.log(fields)
    }
  });
})



//add event

router.post('/acceptEvent', function(req, res) {
  var eventObj = req.body;
  db.query('UPDATE `Events` SET Events.accept = 1 WHERE Events.id = '+ eventObj.eventId +' AND Events.friend_id = '+ eventObj.userId+';',
  function(err, results) {
    if(err) {
      console.log(err)
    } else {
      console.log("success", results)
    }
  });
})


//create events

router.post('/createEvent', function(req, res) {
  var eventObj = req.body;



})




//query for Events created by user ID 1 with names of friends

  //   db.query('SELECT Events.event_name, Users.username, Events.accept, Events.data_entered FROM `Events` INNER JOIN Users ON Events.friend_id = Users.id WHERE Events.user_id = 1', function(err, results) {
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

  //multiple query

// var mysql = require('node-mysql');
// var conn = mysql.createConnection({
//     ...
// });

// var sql = "INSERT INTO Test (name, email, n) VALUES ?";
// var values = [
//     ['demian', 'demian@gmail.com', 1],
//     ['john', 'john@gmail.com', 2],
//     ['mark', 'mark@gmail.com', 3],
//     ['pete', 'pete@gmail.com', 4]
// ];
// conn.query(sql, [values], function(err) {
//     if (err) throw err;
//     conn.end();
// });




module.exports = router;