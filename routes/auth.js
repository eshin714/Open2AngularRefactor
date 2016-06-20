var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
var db = require('../db.js');
var tokens = require('../tokens.js')

router.post('/', function(req, res) {
  var userObj = req.body;
  var encPassword = bcrypt.hashSync(userObj.password, bcrypt.genSaltSync(10));

  db.query('SELECT 1 FROM Users WHERE name = ?', [userObj.username], function(err, results) {
    if(results.length === 0) {
      db.query('insert into Users (name, password, email) values ("' + userObj.username + '", "' + encPassword +'", "' + userObj.email +'")',
        function (err, results, fields) {
          if (err) {
            throw err;
          } else {
            console.log('success', results, fields);
            res.json({
              message: "Success! Created new user."
            })
          }
      });
    } else {
      console.log("Username Does Exist!", results)
      res.send({
        message: "Fail. Username already exists."
      });
    }
  });
});

router.post('/login', function(req, res) {
  var userObj = req.body;

  db.query('SELECT * FROM Users WHERE name = ?', [userObj.username], function(err, results, fields) {
      var user = results[0]

      if(bcrypt.compareSync(userObj.password, user["password"])) {
        console.log("Logging in now!")
        res.json({
          message: "Success! Logging in now.",
          username: user["user"],
          token: tokens.createToken({user: userObj.username})
        })
      } else {
        console.log("Password Incorrect!");
        res.json({
          message: "Fail. Password Incorrect!"
        });
      }
  })
});

module.exports = router;