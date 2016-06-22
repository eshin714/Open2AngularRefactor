var express = require('express');
var jwt = require('jsonwebtoken')
var dbconfig = require('./dbconfig.js')

var tokens = {};

tokens.createToken = function(user) {
  return jwt.sign(user, dbconfig.secret, {
     expiresIn: '1m'
  });
};

tokens.verify = function(token, res) {
  return jwt.verify(token, dbconfig.secret, function(err) {
    if(err) {
      res.json({
        success: false,
        message: 'Failed to authenticate token.'
      });
    } else {
      res.json({
        success: true,
        message: 'User is authorized'
      });
    }
  });
}


module.exports = tokens;