var client=require('./../lib/client');
var express = require('express');
var router = express.Router();
var session=require('./../lib/session');
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(session);

client.on("error", function (err) {
		console.log("Error " + err);
		});


router.post('/:user',function(req,res,next){
});
module.exports = router;
