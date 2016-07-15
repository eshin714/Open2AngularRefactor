var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var morgan = require('morgan');
var db = require('./db');

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
app.use('/chat', chat);


var port = process.env.PORT || 8080;

app.listen(port, console.log('Listening to port', port));