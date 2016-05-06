var express = require('express');
var cors = require('cors');
var setlog=require('./router/lib/log');
var fs = require('fs');
var app = express();
var map = require('./router/map/index');
var vote=require('./router/vote/index');
var lamps =require('./router/lamp/index');
var score=require('./router/score/index');
var visit=require('./router/visit/index');
var account=require('./router/account/index');
var create=require('./router/create/index');
var upload=require('./router/upload/index');

app.use(cors());

app.use("/map",map);
app.use("/visit",visit);
app.use("/vote",vote);
app.use("/lamps",lamps);
app.use("/account",account);
app.use("/score",score);
app.use("/create",create);
app.use("/upload",upload);

app.use(express.static(__dirname + "/public"));

var server = app.listen(5076,function(){
	var host=server.address().address;
	var post=server.address().port;
	var str=('Server is running at http:'+host+post);
	setlog('server.log',str);
});
