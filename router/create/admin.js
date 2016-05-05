var client=require('./../lib/client');
var setlog=require('./../lib/log');
var express = require('express');
var router = express.Router();
var session=require('./../lib/session');
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(session);
router.use(function(req,res,next){
	if(!req.session.site||req.session.site!="admin"){
		setlog('server.log','{"error":" you\'ve not logged in ad administrator"}');
		res.send({"error":" you've not logged in ad administrator"});
	}
	else{
		next();
	}
});

router.post('/',function(req,res,next){
	var admin=req.body.username;
	var passwd=req.body.password;
	client.hmset(admin,"inuse",0,'passwd',passwd,'site','admin',function(err,reply){
		if(err) next(err);
		else res.send('success');
	});
});
module.exports = router;
