var express = require('express');
var router = express.Router();
var db = require('../db.js');
var server = require('../server.js');
var io = require('socket.io').listen(server);

io.on('connection',function(socket){
    console.log("A user is connected");

    socket.on('enterEvent', function(data) {
      console.log("eventering event, here is data", data)
      socket.join(data.eventId);
      showMsg(data, socket);
    })

    socket.on('sendMsg',function(data){
      console.log("This is data", data)
      addMsg(data, socket);
    });

});

function showMsg(data, socket) {
  var eventObj = data;
  db.query('SELECT Users.username, Chats.timestamp, Chats.text FROM `Chats` INNER JOIN Users ON Chats.user_id = Users.id WHERE Chats.event_id ='+ eventObj.eventId +';',
    function(err, results) {
      if(err) {
        console.log(err);
        socket.emit('status', {
          success: false
        })
      } else {
        socket.emit('status', {
          success: true,
          data: results
        })
      }
    }
  )
}

function addMsg(data, socket) {
  var msgObj = data;
  db.query('INSERT INTO `Chats`(`event_id`, `user_id`, `timestamp`, `text`) VALUES ('+msgObj.eventId+', '+msgObj.userId+', NOW(), "'+msgObj.text+'")', function(err, results) {
      if(err) {
        console.log(err);
        socket.emit('status', {
          success: false
        })
      } else {
        db.query('SELECT Users.username, Chats.timestamp, Chats.text FROM `Chats` INNER JOIN Users ON Chats.user_id = Users.id WHERE Chats.id ='+ results.insertId +';',
          function(err, results2) {
          if(err) {
            console.log(err);
            socket.emit('status', {
              success: false
            })
          } else {
            console.log("add msg data",results2)
            socket.emit('sentMsg', results2);
            socket.broadcast.to(data.eventId).emit('receivedMsg', results2);
          }
        }
        )
      }
    }
  )
}



module.exports = router;