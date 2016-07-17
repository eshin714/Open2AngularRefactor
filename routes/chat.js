var express = require('express');
var router = express.Router();
var db = require('../db.js');
var io = require('socket.io')

router.post('/', function(req, res) {
  var eventObj = req.body;
  db.query('SELECT Users.username, Chats.timestamp, Chats.text FROM `Chats` INNER JOIN Users ON Chats.user_id = Users.id WHERE Chats.event_id ='+ eventObj.eventId +';',
    function(err, results) {
      if(err) {
        console.log(err);
        res.json({
          succes: false,
          data: results
        })
      } else {

        res.json({
          success: true,
          message: "Entering Chat",
          data: results
        })
      }
    }
  )
})

router.post('/addMsg', function(req, res) {
  var msgObj = req.body;
  db.query('INSERT INTO `Chats`(`event_id`, `user_id`, `timestamp`, `text`) VALUES ('+msgObj.eventId+', '+msgObj.userId+', NOW(), "'+msgObj.text+'")', function(err, results) {
      if(err) {
        console.log(err);
        res.json({
          succes: false,
          data: results
        })
      } else {
        db.query('SELECT Users.username, Chats.timestamp, Chats.text FROM `Chats` INNER JOIN Users ON Chats.user_id = Users.id WHERE Chats.id ='+ results.insertId +';',
          function(err, results2) {
          if(err) {
            console.log(err);
            res.json({
              succes: false,
              data: results
            })
          } else {
            res.json({
              success: true,
              message: "Msg Added",
              data: results2
            })
          }
        }
        )
      }
    }
  )
})



module.exports = router;