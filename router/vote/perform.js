var client=require('./../lib/client');
var express = require('express');
var router = express.Router();
var session=require('./../lib/session');
var setlog=require('./../lib/log');
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(session);

router.get('/:user',function(req,res){
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
			client.hget(site,'vote',function(err,vote){
				if(!vote) vote=0;
				client.hget(site,'dcount',function(error,dcnt){
					var rest={};
					var logstr=user+' votes '+site+' for '+vote+' stars, and he got ';
					rest.tot=parseInt(vote);
					rest.count=parseInt(dcnt);
					var func= parseInt(vote)/parseInt(dcnt)+parseInt(dcnt)/500;
					client.zadd('vlist',vote,func);
					var rand=Math.random();
					setlog('server.log',rand);
					if(rand<=0.1){
						client.hget('lamp',user,function(errs,repl){
							rest.lamp=undefined;
							if(!repl) {
								repl=0;
							}
							repl++;
							switch((repl)){
								case 1:
								rest.lamp='red';
								logstr+='red';
								break;
								case 2:
								rest.lamp='green';
								logstr+='green';
								break;
								case 3:
								rest.lamp='blue';
								logstr+='blue'
								break;
								case 4:
								rest.lamp='yellow';
								logstr+='yellow';
								break;
							}
							logstr+=' lamp.';
							rest.success=true;
							client.hset('lamp',user,repl);
							setlog('server.log',logstr);
							res.send(rest);
						});
					}
					else{
						rest.lamp=undefined;
						rest.success=true;
						logstr+='none.'
						setlog('server.log',logstr);
						res.send(rest);
					}
				});
			});
		}
	});
});
module.exports = router;
