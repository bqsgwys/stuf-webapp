var express = require('express');
var router = express.Router();

// 定义网站主页的路由
router.get('/', function(req, res) {
	  res.send('Birds home page');
});
// 定义 about 页面的路由
router.get('/about*', function(req, res) {
	  res.send('About birds\r\n'+JSON.stringify(req.params)+'\r\n'+req.url.split('/'));
})

module.exports = router;
