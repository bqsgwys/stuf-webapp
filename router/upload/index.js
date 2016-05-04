var client=require('./../lib/client');
var express = require('express');
var fs=require('fs');
var ctj=require('node-csv-json');
var router = express.Router();
var multipart= require('connect-multiparty')();

router.post('/', multipart, function(req, res, next) {
	  ctj({input: req.files},function(err,reply){
			if(err){
				console.error(err);
				next(err);
			}
			else{
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
					var coor=result.coorination;
					client.sadd('cates',cate);
					client.sadd(cate,site);
					client.hmset(user,"inuse",0,'passwd',passwd,'site',site);
					client.hmset(site+"#info",'name',name,'class',clas,'category',cate,'position',posi,'description',desc,'coordination',coor);
					client.hmset(site,'vote',0,'count',0,'dcount',0,'score',scor);
				});
				res.send('success');
			}
		});
});

module.exports = router;
