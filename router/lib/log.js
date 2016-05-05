var moment = require("moment");
var fs=require('fs');
var setlog = function(path,logstr){
	logstr='['+ moment().format('MMMM Do YYYY, h:mm:ss a')+']'+logstr;
	console.log(logstr);
fs.appendFile(path,logstr+"\r\n",(err)=>{
if(err) console.log(err);
});
}

module.exports=setlog;
