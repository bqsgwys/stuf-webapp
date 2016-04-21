var redis = require("redis"),
		client = redis.createClient();
var session=require('express-session');
var cookie=require('cookie-parser');
var RedisStore = require('connect-redis')(session);
var express = require('express');
var redis = require('redis');
var router = express.Router();


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

router.get('/perform/:user',function(req,res){
	var user=req.params.user;
	var site=req.session.site;
	var vote=req.query.score;
	client.get(site+'#vote',function(err,reply){
		client.get(user+'#'+site,function(errr,rep){
			var rest={};
			if(reply){
				rest.lamp=undefined;
				rest.success=false;
				res.send(rest);
			}
			else{
				client.get(site+'#dcount',function(error,dcnt){
					client.set(site+'#dcount',(dcnt+1));
					var num=reply+0;
					num=num+vote;
					client.set(user+'#'+site,vote);
					client.set(site+'#vote',num);
					if(Math.random()<0.1){
						client.get(user+'#lamp',function(errs,repl){
							rest.lamp=undefined;
							switch((repl+0)){
								case 1:
								rest.lamp='red';
								repl++;
								break;
								case 2:
								rest.lamp='green';
								repl++;
								break;
								case 3:
								rest.lamp='blue';
								repl++;
								break;
								case 4:
								rest.lamp='yellow';
								repl++;
								break;
							}
							rest.success=true;
							client.set(user+'#lamp',repl);
							res.send(rest);
						});
					}
					else{
						rest.lamp=undefined;
						rest.success=true;
						res.send(rest);
					}
				});
			}
		});
	});
});

router.get('/:user',function(req,res){
	var site=req.params.site;
	var user=req.params.user;
	client.get(user+'#'+site,function(err,re){
		res.send(re);
	});
});

router.get('/',function(req,res){
	var site=req.session.site;
	client.get(site+'#vote',function(err,vote){
		client.get(site+'#dcount',function(error,dcnt){
			var rest={};
			rest.tot=vote+0;
			rest.count=dcnt+0;
		});
	});
});
module.exports = router;
