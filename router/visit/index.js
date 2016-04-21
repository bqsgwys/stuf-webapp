var redis = require("redis"),
		client = redis.createClient();
var express = require('express');
var redis = require('redis');
var router = express.Router();
var session=require('express-session');
var cookie=require('cookie-parser');
var RedisStore = require('connect-redis')(session);

router.use(session({
	store: new RedisStore({
		host: "127.0.0.1",	
		port: 6379,
		db: "session"
	}),
	secret: 'stuf'
}));
client.on("error", function (err) {
		console.log("Error " + err);
		});
router.use(function(req,res,next){
	if(req.session.site){
		next();
	}
	else{
		res.send({'error':'NotLoggedIn'});
	}
});
router.get('/:user', function(req, res, next){
	var user = req.params.user;
	var site = req.session.sites;
	var obj=user+'#'+site;
	client.get(obj,function(ierr,reply){
		var ct = site+'#count';
		client.get(ct,function(derr,count){
			client.set(ct,count+1);
			client.get(site+'#score',function(terr,siscore){
				client.get(user+'#score',function(ferr,usscore){
					var total=usscore+siscore;
					client.set(user+'#score',total);
					client.get('topuser',function(eerr,topst){
						var top=JSON.parse(topst);
						for(var i=0;i<10;i++){
							if(total>top[i.toString()].score){
								for(var j=8;j>=i;j++){
									var k=j+1;
									top[k.toString()].score=top[j.toString()].score;
									top[k.toString].name=top[j.toString()].name;
								}
								top[i.toString()].score=total;
								top[i.toString()].name=user;
							}
						}
						var strin=JSON.stringify(top);
						if(strin!=topst){
							client.set('topuser',strin);
						}
						if(reply) res.send(0);
						else res.send(1);
					});
				});
			});
		});
	});
});

module.exports = router;
