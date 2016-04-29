var client=require('./../lib/client');
var express = require('express');
var redis = require('redis');
var router = express.Router();

router.get("/",function(req,res){
	client.smembers("cates", function(err, reply) {
		res.send(reply);
	});
});

module.exports = router;
