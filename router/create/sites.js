var client=require('./../lib/client');
var express = require('express');
var router = express.Router();
var session=require('./../lib/session');
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(session);
router.use(function(req,res,next){
	if(!req.session.site||req.session.site!="admin"){
		res.status(500).send("ERROR you've not logged in ad administrator");
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
	var coor=req.body.coorination;
	client.sadd('cates',cate);
	client.sadd(cate,site);
	client.hmset(user,"inuse",0,'passwd',passwd,'site',site);
	client.hmset(site+"#info",'name',name,'class',clas,'category',cate,'position',posi,'description',desc,'coordination',coor);
	client.hmset(site,'vote',0,'count',0,'dcount',0,'score',scor);
	res.send('success');
});
module.exports = router;
