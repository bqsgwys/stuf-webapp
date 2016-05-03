var client=require('./../lib/client');
var express = require('express');
var router = express.Router();

router.get('/',function(req,res,next){
  client.smembers('cates',function(err,reply){
    Promise.all(reply.map(function(cate){
      return new Promise(function(resolve, reject){
        client.smembers(cate,function(errd,rep){
          resolve(rep);
        });
      });
    })).then(function(results){
      var promises = results.reduce(function(prev,elem){
        var subpromises = elem.map(function(sites){
          return new Promise(function(resolve,reject){
            client.hgetall(sites+'#info',(errs,repl) => errs ? reject(err) : resolve(repl));
          });
        });

				return prev.concat(subpromises);
      }, []);

			return Promise.all(promises);
    }).then(function(result) {
			console.log(result);
      res.send(result);
    }).catch(function(errors){
      return next(errors);
    });
  });
});
module.exports = router;
