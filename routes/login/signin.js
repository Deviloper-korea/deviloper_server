const express = require('express');
const router = express.Router();
const pool = require('../config/dbpool');
const crypto = require('crypto');
const async = require('async');

router.post('/', function(req, res, next) {
     let tasks = [
          (callback) => {
               pool.getConnection((err, connection) => {
                    if (err) {
                         res.status(500).send({
                              stat: "fail"
                         });
                         connection.release();
                         callback("connection error : " + err, null);
                    } else {
                         let selectquery = "select email, pwd, salt from info where email=?;";
                         connection.query(selectquery, [req.body.email], (err, rows) => {
                              if (err) {
                                   res.status(500).send({
                                        stat: "fail"
                                   });
                                   connection.release();
                                   callback("query error : " + err, null);
                              }else{
                                   callback(null, connection, rows);
                              }
                         });
                    }
               });
          },
          (connection, rows, callback)=>{
               if(!rows){
                    res.status(500).send({
                         stat:fail
                    });
                    connection.release();
                    callback("err : " + err, null);
               }
               else{
                    if(rows[0].email == req.body.email){
                         crypto.pbkdf2(req.body.pwd, rows[0].salt, 100000, 64, 'sha512', function(err, hashed){
                              if(err){
                                   res.status(500).send({
                                        stat:fail
                                   });
                                   connection.release();
                                   callback("hashing err : " + err, null);
                              }else{
                                   callback(null, connection, rows, hashed);
                              }
                         });
                    }
               }
          },
          (connection,rows, hashed,callback)=>{
               if(hashed.toString('base64') == rows[0].pwd){
                    res.status(201).send({
                         stat: "success",
                         data : {
                              "email" : rows[0].email,
                              "nick":rows[0].nick,
                              "age":rows[0].age
                         }
                    });
               }
               callback(null, "sign in success : " + rows[0].email);
          }

     ];
     async.waterfall(tasks, (err, result)=>{
          if(err) console.log(err);
          else console.log(result);
     });
});


module.exports = router;
