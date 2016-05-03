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

router.get('/:user', function(req, res, next){
	var user = req.params.user;
	var site = req.session.site;
	var obj=user+'#'+site;
	client.hget(site,user+'.vote',function(ierr,reply){
		client.hincrby(site,'count',1);
		client.hget(site,'score',function(terr,siscore){
			client.zadd('slist','INCR',siscore,user);
			if(!reply) res.send('0');
			else res.send(reply);
		});
	});
});

module.exports = router;
