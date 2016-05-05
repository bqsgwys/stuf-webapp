var client=require('./../lib/client');
var setlog=require('./../lib/log');
var express = require('express');
var redis = require('redis');
var router = express.Router();

router.get("/",function(req,res){
	client.smembers("cates", function(err, reply) {
		setlog('server.log','get all sites');
		res.send(reply);
	});
});

module.exports = router;
