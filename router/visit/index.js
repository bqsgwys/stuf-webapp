var redis = require("redis"),
		client = redis.createClient();
var express = require('express');
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
	client.hget(site,user+'.vote',function(ierr,reply){
		client.hincrby(site,'count',1);
		client.hget(site,'score',function(terr,siscore){
			client.zadd('slist','INCR',siscore,user);
			if(!reply) res.send(0);
			else res.send(reply);
		});
	});
});

module.exports = router;
