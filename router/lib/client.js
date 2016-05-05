var redis = require("redis"),
		client = redis.createClient();
var setlog=require('./../lib/log');

client.on("error", function (err) {
		setlog('server.log',"Error " + err);
		});

module.exports = client;
