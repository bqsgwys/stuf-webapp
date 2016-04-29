var client=require('./../lib/client');
var express = require('express');
var router = express.Router();
var session=require('./../lib/session');
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(session);
router.use(function(req,res,next){
	if(!req.session.site||req.session.site!="admin"){
		res.status(500).send("ERROR you've not logged in as admin");
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
