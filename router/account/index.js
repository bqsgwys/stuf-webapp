var client=require('./../lib/client');
var setlog=require('./../lib/log');
var express = require('express');
var router = express.Router();
var session=require('./../lib/session');
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(session);

router.post('/login',function(req,res){
	if(req.session.site){ 
		var rest={};
		rest.success=false;
		setlog('server.log',req.session.site+' is trying to log in but failed for "AlreadyLoggedIn"')
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
				setlog('server.log',username+' is trying to log in but failed for AccountInUse"')
				res.send(rest);
			}
			else{
				client.hget(username,'passwd',function(er,pass){
					if(pass!=passwd){
						var rest={};
						rest.success=false;
						rest.error='CredentialsRejected';
						setlog('server.log',username+' is trying to log in but failed for "CredentialsRejected"')
						res.send(rest);
					}
					else{
						client.hget(username,'site',function(error,sites){
							client.hset(username,'inuse',1);
							req.session.site=sites;
							req.session.user=username;
							var rest={};
							rest.success=true;
							setlog('server.log',username+' is trying to log in and success')
							rest.site=sites;
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
		setlog('server.log',site+' is trying to log out and success')
		rest.success=true;
	}
	else{
		var rest={};
		rest.success=false;
		rest.error='NotLoggedIn';
		setlog('server.log',site+' is trying to log in but failed for "NotLoggedIn"')
	}
	res.send(rest);
});

router.get('/restore',function(req,res){
	var rest={};
	if(req.session.site){
		rest.site=req.session.site;
		setlog('server.log',req.session.site+' is trying to log in and success')
		rest.success=true;
	}
	else{
		rest.success=false;
		rest.error='NotLoggedIn';
		setlog('server.log',req.session.site+' is trying to log in but failed for "NotLoggedIn"')
	}
	res.send(rest);
});

module.exports = router;
