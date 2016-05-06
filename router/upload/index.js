var client=require('./../lib/client');
var express = require('express');
var fs=require('fs');
var ctj=require('node-csv-json');
var router = express.Router();
var multipart= require('connect-multiparty')();
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

router.get('/',(req,res,next)=>{
	res.status(200).send("<form method='post' action='upload' enctype='multipart/form-data'><input type='file' name='fileUploaded'><input type='submit'></form>");
});

router.post('/', multipart, function(req, res, next) {
	  var rest={};
		console.log(req.files.fileUploaded.path);
		rest['input']=req.files.fileUploaded.path;
		rest['output']='sample.json';
		var promise=new Promise((resolve,reject)=>{
		ctj(rest,function(err,reply){
			if(err){
				console.error(err);
				return next(err);
			}
			else{
				console.log(reply);
				reply.forEach(function(result){
					var user=result.username;
					var pass=result.password;
					var name=result.name;
					var site=result.site;
					var scor=result.score;
					var clas=result.class;
					var cate=result.category;
					var posi=result.position;
					var desc=result.description;
					var coor=result.coordination;
					client.sadd('cates',cate);
					client.sadd(cate,site);
					client.hmset(user,"inuse",0,'passwd',pass,'site',site);
					client.hmset(site+"#info",'name',name,'class',clas,'category',cate,'position',posi,'description',desc,'coordination',coor);
					client.hmset(site,'vote',0,'count',0,'dcount',0,'score',scor);
				});
				fs.unlink(path);
				fs.unlink('sample.json');
				return res.send('success');
			}
		});
});

module.exports = router;
