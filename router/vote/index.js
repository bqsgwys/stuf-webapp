var client=require('./../lib/client');
var express = require('express');
var router = express.Router();
var session=require('./../lib/session');
var bodyParser = require('body-parser');
var perform = require('./perform')
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

router.use('/perform', perform);

router.get('/leader/vote',function(req,res){
	
});

router.get('/:user',function(req,res){
		var site=req.session.site;
		var user=req.params.user;
		client.hget(site,user+'.vote',function(err,re){
			if(!re||re.length==0){
				re=0;
			}
			res.send(re);
			});
		});

router.get('/',function(req,res){
		var site=req.session.site;
		client.hget(site,'vote',function(err,vote){
			client.hget(site,'dcount',function(error,dcnt){
				var rest={};
				rest.tot=parseInt(vote);
				rest.count=parseInt(dcnt);
				res.send(rest);
				});
			});
		});
module.exports = router;
