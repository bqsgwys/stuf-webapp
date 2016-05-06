var client=require('./../lib/client');
var express = require('express');
var router = express.Router();
var session=require('./../lib/session');
var setlog=require('./../lib/log');
var bodyParser = require('body-parser');
var perform = require('./perform')
router.use(bodyParser.urlencoded({ extended: false }));
router.use(session);

router.get('/',function(req,res){
		var site=req.session.site;
		client.hget(site,'vote',function(err,vote){
			if(!vote) vote=0;
			client.hget(site,'dcount',function(error,dcnt){
				var rest={};
				rest.tot=parseInt(vote);
				rest.count=parseInt(dcnt);
				setlog('server.log',"get "+site+"'s vote and different count");
				res.send(rest);
				});
			});
		});

router.get('/leaders/:numbers',function(req,res){
	var num=parseInt(req.params.numbers);
	num=0-num;
	client.zrange('vlist',num,-1,'WITHSCORES',function(err,repl){
	setlog('server.log',"vote"+"get vote's leaderboard");
		var rest={};
		for(var i=0;i<0-num;i++){
			var key=repl[i*2];
			var va=repl[i*2+1];
			rest[key]=va;
		}
		res.send(rest);
	});
});

router.use(function(req,res,next){
	if(req.session.site){
		next();
	}
	else{
		setlog('server.log',"vote"+"{'error':'NotLoggedIn'}")
		res.send({'error':'NotLoggedIn'});
	}
});

router.use('/perform', perform);


router.get('/:user',function(req,res){
		var site=req.session.site;
		var user=req.params.user;
		client.hget(site,user+'.vote',function(err,re){
			if(!re||re.length==0){
				re=0;
			}
			setlog('server.log',site+" want to get "+user+"'s vote")
			res.send(re);
			});
		});

module.exports = router;
