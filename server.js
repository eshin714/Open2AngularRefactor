var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var morgan = require('morgan');
var db = require('./db');

// routes
var tokens = require('./tokens')
var main = require('./routes/main');
var auth = require('./routes/auth');

app.use(express.static(__dirname + '/client'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));

app.use('/main', main);
app.use('/auth', auth);

var port = process.env.PORT || 8080;

app.listen(port, console.log('Listening to port', port));