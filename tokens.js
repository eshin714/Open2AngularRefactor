var express = require('express');
var jwt = require('jsonwebtoken')
var dbconfig = require('./dbconfig.js')

var tokens = {};

tokens.createToken = function(user) {
  return jwt.sign(user, dbconfig.secret, {
     expiresIn: '1440m'
  });
};

tokens.verify = function(token) {
  return jwt.verify(token, dbconfig.secret, function(err, decoded) {
    if(err) {
      return res.json({
        success: false,
        message: 'Failed to authenticate token.'
      });
    } else {
      req.decoded = decoded;
      next();
    }
  });
}


module.exports = tokens;