var server = require('./server.js');
var io = require('socket.io').listen(server);

io.on('connection',function(socket){
    console.log("A user is connected");
    socket.on('chat',function(data){

      console.log("This is data", data)
    });
});