var redis = require("redis"),
		client = redis.createClient();
client.on("error", function (err) {
		console.log("Error " + err);
		});
var express = require('express');
var router = express.Router();

router.get('/:user',function(req,res){
	var user=req.params.user;
	client.zincrby('slist',0,user,function(err,reply){
		var out={};
		if(reply) out['score']=+parseInt(reply);
		else out.score=0;
		res.send(out);
	});
});
router.get('/leaders/:numbers',function(req,res){
	var num=(req.params.numbers+0);
	client.zrange('slist',0,num,'WITHSCORES',function(err,repl){
		var rest={};
		for(var i=0;i<num;i++){
			var key=repl[i*2];
			var va=repl[i*2+1];
			rest[key]=va;
		}
		res.send(rest);
	});
});
module.exports = router;
