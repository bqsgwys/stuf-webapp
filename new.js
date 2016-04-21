var redis = require("redis"),
		client = redis.createClient();

// if you'd like to select database 3, instead of 0 (default), call
// client.select(3, function() { /* ... */ });

client.on("error", function (err) {
		console.log("Error " + err);
		});
var js = {'asd':10,'qwe':50};
console.log(js);
console.log(JSON.stringify(js));
client.set("string key", "string val", redis.print);
client.hset("hash key", "hashtest 1", "some value", redis.print);
client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
client.hkeys("hash key", function (err, replies) {
		console.log(replies.length + " replies:");
		replies.forEach(function (reply, i) {
			console.log("    " + i + ": " + reply);
			});
		client.quit();
		});
client.get("missingkey", function(err, reply) {
		// reply is null when the key is missing
		console.log(reply);
		});
client.set("missingkey", JSON.stringify(js));
client.get("missingkey", function(err, reply) {
		// reply is null when the key is missing
		console.log(JSON.parse(reply));
		});
