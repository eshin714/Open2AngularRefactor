var express = require('express');
var mysql = require('mysql');
var dbconfig = require('./dbconfig.js')
var http = require('http').Server(express());
var io = require('socket.io')(http);

console.log(io)
        io.on('connection', function(socket){
  console.log("in chat")
  socket.on('chat message', function(msg){
    console.log('message: ' + msg.message);
  });
});

var connection = mysql.createConnection(dbconfig.sqlConfig);

  connection.connect(function(err){
    if(!err) {
       console.log("Database is connected ...");
    } else {
       console.log("Error connecting database ...", err);
    }
    });

module.exports = connection;