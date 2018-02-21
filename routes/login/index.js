var express = require('express');
var router = express.Router();
var signup= require('./signup');
var signin = require('./signin');
router.use('/signup',signup);
router.use('/signin', signin);


module.exports = router;
