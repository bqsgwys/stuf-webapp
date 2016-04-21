var redis = require("redis"),
		client = redis.createClient();
client.on("error", function (err) {
		console.log("Error " + err);
		});
var express = require('express');
var redis = require('redis');
var router = express.Router();

router.get('/:user',function(req,res){
	var user=req.params.user;
	client.get(user+'#score',function(err,reply){
		var out={};
		out['score']=+reply;
		res.send(out);
	});
});
router.get('/leaders/:numbers',function(req,res){
	var num=(req.params.numbers+0);
	if(num>10) num=10;
	client.get('topuser',function(ferr,topst){
		var top=JSON.parse(topst);
		var rest={};
		for(var i=0;i<num;i++){
			rest[i.toString()]=top[i.toString()];
		}
		res.send(rest);
	});
});
module.exports = router;
