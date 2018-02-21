var express = require('express');
var router = express.Router();
var login = require('./login/index');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.use('/login', login);


module.exports = router;
