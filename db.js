var express = require('express');
var mysql = require('mysql');
var dbconfig = require('./dbconfig.js')

var connection = mysql.createConnection(dbconfig.sqlConfig);

  connection.connect(function(err){
    if(!err) {
       console.log("Database is connected ...");
    } else {
       console.log("Error connecting database ...", err);
    }
    });

module.exports = connection;