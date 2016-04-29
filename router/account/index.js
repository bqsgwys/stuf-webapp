var client=require('./../lib/client');
var express = require('express');
var router = express.Router();
var session=require('./../lib/session');
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(session);


router.get('/login',function(req,res){
	if(req.session.site){ 
		var rest={};
		rest.success=false;
		rest.error='AlreadyLoggedIn';
		res.send(rest);
	}
	else{
		var username=req.body.username;
		var passwd=req.body.password;
		client.hget(username,'inuse',function(err,reply){
			if((reply+0)==1){
				var rest={};
				rest.success=false;
				rest.error='AccountInUse';
				res.send(rest);
			}
			else{
				client.hget(username,'passwd',function(er,pass){
					if(pass!=passwd){
						var rest={};
						rest.success=false;
						rest.error='CredentialsRejected';
						res.send(rest);
					}
					else{
						client.hget(username,'site',function(error,sites){
							client.hset(username,'inuse',1);
							req.session.site=sites;
							req.session.user=username;
							var rest={};
							rest.success=true;
							rest.site=sites
							res.send(rest);
						});
					}
				});
			}
		});
	}
});

router.get('/logout',function(req,res){
	var user=req.session.user;
	var site=req.session.site;
	var rest={};
	if(site){
		req.session.destroy();
		client.set(user+'#inuse',0);
		rest.success=true;
	}
	else{
		var rest={};
		rest.success=false;
		rest.error='NotLoggedIn';
	}
	res.send(rest);
});

router.get('/restore',function(req,res){
	var rest={};
	if(req.session.site){
		rest.site=req.session.site;
		rest.success=true;
	}
	else{
		rest.success=false;
		rest.error='NotLoggedIn';
	}
	res.send(rest);
});

module.exports = router;
