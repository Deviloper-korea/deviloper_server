const express = require('express');
const router = express.Router();
const pool = require('../../config/dbpool');
const crypto = require('crypto');
const async = require('async');

/*회원가입 페이지*/

router.post('/', function(req, res, next) {
  let taskArray = [
    (callback) => {
      pool.getConnection((err, connection) => {
        if(err) {
          connection.release();
          res.status(500).send({
            stat:'fail'
          });
          callback("errer"+err, null);
        }else{
          callback(null, connection);
        }
      });
    },

    (connection, callback) => {
      crypto.randomBytes(32, function(err, buffer){
        if(err){
          res.status(500).send({
            stat:'fail'
          });
          connection.release();
          callback("errer"+err, null);
        }else{
            callback(null, connection, buffer);
        }
      });
    },

    (connection, buffer, callback) => {
      let insertquery = "insert into user(id,nickname,profileImg,password) values (?,?,?,?);";
      connection.query(insertquery,[req.body.id,req.body.nickname,req.body.profileImg,req.body.password],(err,rows) =>{
        if(err){
          res.status(501).send({
            stat:'not available'
          });
          connection.release();
          callback("errer"+err, null);
        }else{
          callback(null, connection, buffer, rows);
        }
      });
    },

    (connection, buffer, rows, callback) => {
      res.status(201).send({
        stat:"success",
        data:{
          "id": req.body.id,
          "nickname" : req.body.nickname
        }
      });
      connection.release();
      callback(null, null);
    }
  ];

  async.waterfall(taskArray, (err, result) => {
     if(err) console.log(err);
     else console.log(result);
  });
});


module.exports = router;
