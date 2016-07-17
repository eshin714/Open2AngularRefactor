var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var morgan = require('morgan');
var db = require('./db');
var http = require('http').Server(app);
var io = require('socket.io')(http);

// routes
var tokens = require('./tokens')
var auth = require('./routes/auth');
var dashboard = require('./routes/dashboard');
var chat = require('./routes/chat');

app.use(express.static(__dirname + '/client'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));


app.use('/auth', auth);
app.use('/dashboard', dashboard);

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

io.on('connection', function(socket){
  console.log("in chat")
  socket.on('chat message', function(msg){
    console.log('message: ' + msg.message);
  });
});


var port = process.env.PORT || 8080;

http.listen(port, console.log('Listening to port', port));

app.use('/chat', chat);