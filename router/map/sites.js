var redis = require("redis"),
		client = redis.createClient();

// if you'd like to select database 3, instead of 0 (default), call
// client.select(3, function() { /* ... */ });

client.on("error", function (err) {
		console.log("Error " + err);
		});
var express = require('express');
var router = express.Router();

router.get('/',function(req,res){
	client.get('sites',function(err,reply){
		res.send(reply);	
	});
});
module.exports = router;
