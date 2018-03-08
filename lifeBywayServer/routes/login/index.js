var express = require('express');
var router = express.Router();
var signup = require('./signup');

router.use('/signup',signup);


module.exports = router;
