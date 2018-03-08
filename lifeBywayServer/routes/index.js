var express = require('express');
var router = express.Router();
var login = require('./login/index');

router.use('/login',login);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
