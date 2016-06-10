var express = require('express');
var router = express.Router();
var db = require('../db.js');

router.post('/', function(req, res) {
  var userObj = req.body;
  console.log('This is user Obj',userObj)
  db.query('insert into Users (name, password, email) values ("' + userObj.username + '", "' + userObj.password +'", "' + userObj.email +'")',
    function selectCb(err, results, fields) {
    if (err) throw err;
    else console.log('success', results)
});


})

module.exports = router;