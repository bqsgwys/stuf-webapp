var express = require('express');
var fs = require('fs');
var app = express();

app.get("/*", function (req, res) {
	console.log(req.url);
	  res.send(req.url.split('/'));
});

var server = app.listen(3000,function(){
	var host=server.address().address;
	var post=server.address().port;
	console.log('Server is running at http://%s:%s',host,post);
})
