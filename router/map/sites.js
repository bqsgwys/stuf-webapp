var client=require('./../lib/client');
var express = require('express');
var setlog=require('./../lib/log');
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
      setlog('server.log','get all sites');
      res.send(result);
    }).catch(function(errors){
      return next(errors);
    });
  });
});

router.get('/:id', function(req, res, next) {
  client.hgetall(req.params.id + "#info", (err, replinfo) => {
    if(err) return next(err);
    else return res.send(replinfo);
  });
});

router.get('/admin/:id', 
function(req,res,next){
  if(!req.session.site||req.session.site!="admin"){
    setlog('server.log','{"error":" you\'ve not logged in ad administrator"}');
    res.send({"error":" you've not logged in ad administrator"});
  }
  else{
    next();
  }
},

function(req, res, next) {
  client.hgetall(req.params.id, (err, repl) => {
    if(err) return next(err);

    if(repl.name) {
      // Is a site
      client.hgetall(req.params.id + "#info", (err, replinfo) => {
        if(err) return next(err);
        else res.send({
          info: replinfo,
          data: repl
        });
      });
    } else {
      res.sendStatus(404);
    }
  });
});
module.exports = router;
