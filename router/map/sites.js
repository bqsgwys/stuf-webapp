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
      return Promise.all(results.reduce(function(prev,elem){
        var subpromises = elem.map(function(sites){
          return new Promise(function(resolve,reject){
            client.hgetall(sites+'#info',function(errs,repl){
              var rest = {};
              for(var i=0;i<(repl.length/2);++i){
                rest[repl[i*2]]=repl[i*2+1];
              }
              resolve(rest);
            });
          });
        });
        prev.concat(subpromises);
      }, []));
    }).then(function(result) {
      res.send(result);
    }).catch(function(errors){
      return next(errors);
    });
  });
});
module.exports = router;
