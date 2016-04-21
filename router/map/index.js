var express = require('express');
var router = express.Router();
var categories = require('./categories');
var sites = require('./sites')

router.use('/categories',categories);
router.use('/sites',sites);
module.exports = router;
