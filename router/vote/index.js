var redis = require("redis"),
		client = redis.createClient();
var session=require('express-session');
var cookie=require('cookie-parser');
var RedisStore = require('connect-redis')(session);
var express = require('express');
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
	client.hget(site,user+'.vote',function(errr,rep){
		var rest={};
		if(rep){
			rest.lamp=undefined;
			rest.success=false;
			res.send(rest);
		}
		else{
			client.hincrby(site,'dcount',1);
			client.hset(site,user+'.vote',vote);
			client.hincrby(site,'vote',vote);
      if(Math.random()<0.1){
        client.hget('lamp',user,function(errs,repl){
          rest.lamp=undefined;
          if(!repl) {
          repl=0;
          }
          repl++;
          switch((repl)){
            case 1:
            rest.lamp='red';
            break;
            case 2:
            rest.lamp='green';
            break;
            case 3:
            rest.lamp='blue';
            break;
            case 4:
            rest.lamp='yellow';
            break;
          }
          rest.success=true;
          client.set('lamp',user,repl);
          res.send(rest);
        });
      }
      else{
        rest.lamp=undefined;
        rest.success=true;
        res.send(rest);
      }
	  }
	});
});

router.get('/:user',function(req,res){
		var site=req.params.site;
		var user=req.params.user;
		client.hget(site,user+'.vote',function(err,re){
			res.send(re);
			});
		});

router.get('/',function(req,res){
		var site=req.session.site;
		client.hget(site,'vote',function(err,vote){
			client.hget(site,'dcount',function(error,dcnt){
				var rest={};
				rest.tot=vote+0;
				rest.count=dcnt+0;
				});
			});
		});
module.exports = router;
