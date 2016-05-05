var express = require('express');
var setlog=require('./../lib/log');
var router = express.Router();
var admin = require('./admin');
var sites = require('./sites')

router.use('/admin',admin);
router.use('/sites',sites);
module.exports = router;
