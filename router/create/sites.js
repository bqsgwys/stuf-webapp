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
	var user=req.body.username;
	var pass=req.body.password;
	var name=req.body.name;
	var site=req.body.site;
	var scor=req.body.score;
	var clas=req.body.class;
	var cate=req.body.category;
	var posi=req.body.position;
	var desc=req.body.description;
	var coor=req.body.coordination;
	client.hget(site+'#info',category,(err,repl)=>{
		if(repl)
			if(repl!=cate){
				res.send({"error":'Same site in different category'});
				return ;
			}
		client.sadd('cates',cate);
		client.sadd(cate,site);
		client.hmset(user,"inuse",0,'passwd',pass,'site',site);
		client.hmset(site+"#info",'name',name,'class',clas,'category',cate,'position',posi,'description',desc,'coordination',coor, 'score', scor);
		setlog('server.log','add a site '+site+' to the database');
		res.send('success');
	});
});
module.exports = router;
