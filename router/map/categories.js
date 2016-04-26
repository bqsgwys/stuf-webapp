var redis = require("redis"),
		client = redis.createClient();


client.on("error", function (err) {
		console.log("Error " + err);
		});
var express = require('express');
var redis = require('redis');
var router = express.Router();

router.get("/",function(req,res){
	client.smembers("categories", function(err, reply) {
		res.send(reply);
	});
});

module.exports = router;
