var redis = require("redis"),
		client = redis.createClient();
client.on("error", function (err) {
		console.log("Error " + err);
		});
var express = require('express');

var bodyParser = require('body-parser');
var redis = require('redis');
var router = express.Router();


router.get('/:user',function(req,res){
	var user=req.params.user;
	client.get(user+'#lamp',function(err,re){
		rest=[];
		rest.lamp=undefined;
		switch((repl+0)){
			case 1:
			rest=['red'];
			break;
			case 2:
			rest=['red','green'];
			break;
			case 3:
			rest=['red','green','blue'];
			break;
			case 4:
			rest=['red','green','blue','yellow'];
			break;
		}
		res.send(rest);
	});
});

module.exports = router;
