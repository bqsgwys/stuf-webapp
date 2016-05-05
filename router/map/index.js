var express = require('express');
var router = express.Router();
var setlog=require('./../lib/log');
var categories = require('./categories');
var sites = require('./sites')

router.use('/categories',categories);
router.use('/sites',sites);
module.exports = router;
