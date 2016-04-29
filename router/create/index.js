var express = require('express');
var router = express.Router();
var admin = require('./admin');
var sites = require('./sites')
var user = require('./user')

router.use('/admin',admin);
router.use('/sites',sites);
router.use('/',user);
module.exports = router;
