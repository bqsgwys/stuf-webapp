var client=require('./../lib/client');
var express = require('express');
var router = express.Router();
var session=require('./../lib/session');
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(session);
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
