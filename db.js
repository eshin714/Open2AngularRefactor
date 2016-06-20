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



  // connection.query('SELECT * FROM Users',function(err,rows){
  //   if(err) throw err;

  //   console.log('Data received from Db:\n');
  //   console.log(rows);
  // });

//   connection.query('insert into Users (name, password, email) values ("roger", "123", "roger@yahoo.com")',
//     function selectCb(err, results, fields) {
//     if (err) throw err;
//     else console.log('success')
// });
