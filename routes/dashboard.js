var express = require('express');
var router = express.Router();
var db = require('../db.js');

router.post('/', function(req, res) {
  var userId = req.body.id;
  db.query('SELECT username, user_id, friend_id FROM Friends, Users WHERE user_id = ' + userId + '  AND Users.id = Friends.friend_id;SELECT Events.event_name, Events.user_id, Events.friend_id, Events.accept, Users.username FROM `Events`, Users WHERE Events.friend_id = Users.id AND Events.user_id = '+ userId +';', function(err, results) {
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

//add friend


  // db.query('SELECT Users.username, Users.id, Friends.friend_id, Events.event_name FROM Friends, Users, Events Where Users.id = 1 AND Users.id = Friends.friend_id AND Events.user_id = Users.id;', function(err, results) {
  //   if(err) {
  //     console.log(err)
  //   } else {
  //     console.log("success", results)
  //   }
  // });


//add event

  // db.query('INSERT INTO Events (`event_name`, `user_id`, `friend_id`) VALUES ("Party!",1,3)', function(err, results) {
  //   if(err) {
  //     console.log(err)
  //   } else {
  //     console.log("success")
  //   }
  // });



//populate events

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