const express = require('express');
const router = express.Router();
const pool = require('../config/dbpool');
const crypto = require('crypto');
const async = require('async');

router.post('/', function(req, res, next) {
     tasks = [(callback) => {
          pool.getConnection((err, connection) => {
               if (err) {
                    res.status(500).send({
                         stat: "fail"
                    });
                    connection.release();
                    callback("connection error : " + err, null);
               } else {
                    callback(null, connection);
               }
          });
     }, (connection, callback) => {
          crypto.randomBytes(32, function(err, buffer) {
               if (err) {
                    res.status(500).send({
                         stat: "fail"
                    });
                    connection.release();
                    callback("randomBytes error : " + err, null);
               } else {
                    callback(null,connection,  buffer);
               }
          });
     }, (connection, buffer, callback) => {
          crypto.pbkdf2(req.body.pwd, buffer.toString('base64'), 100000, 64, 'sha512', function(err, hashed) {
               if (err) {
                    res.status(500).send({
                         stat: "fail"
                    });
                    connection.release();
                    callback("pbkdf2 error : " + err, null);
               } else {
                    callback(null, connection, buffer, hashed);
               }
          });
     }, (connection, buffer, hashed, callback) => {
          let insertquery = "insert into info(email,nick,age,pwd,salt) values(?,?,?,?,?);";
          connection.query(insertquery, [req.body.email, req.body.nick, req.body.age, hashed.toString('base64'), buffer.toString('base64')], (err, rows) => {
               if (err) {
                    res.status(500).send({
                         stat: "fail"
                    });
                    connection.release();
                    callback("queury error : " + err, null);
               } else {
                    res.status(201).send({
                         stat: "success",
                         data: {
                              "email": req.body.email,
                              "nick": req.body.nick,
                              "age": req.body.age
                         }

                    });
                    connection.release();
                    callback(null, "sign up success");
               }
          });

     }];
     async.waterfall(tasks, (err, result)=>{
          if(err) console.log(err);
          else console.log(result);
     });
});





module.exports = router;
