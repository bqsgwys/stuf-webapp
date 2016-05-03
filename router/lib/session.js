var session=require('express-session');
var cookie=require('cookie-parser');
var RedisStore = require('connect-redis')(session);

var mod=session({
	store: new RedisStore({
		host: '127.0.0.1',
		port: 6379,
		db: 1
	}),
	secret: 'stuf',
	resave: 'false',
	saveUninitialized: 'false'
});

module.exports = mod;
