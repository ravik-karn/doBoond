var express = require('express');
var mysql = require("mysql");
var passwordHash = require('password-hash')
var authenticator = require("./app/ver/authentication")
var bodyParser = require('body-parser');
var db = require ('./app/Database/connection')

// start express
var app = express();


// to parse post data 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var port = 8000;
var router = express.Router();


// to allow cross domain  access

allowCrossDomain = function(req, res, next){
	  res.header('Access-Control-Allow-Origin', '*');
	  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, x-access-token');
	  if ('OPTIONS' === req.method) {
	    res.send(200);
	  } else {
	    next();
	}
}
app.use(allowCrossDomain);
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});


router.get('/authenticate',authenticator.isAccessibleuser,function(req,res){
    res.json({success : true,message :'Authenticated'});
})
router.post('/authenticate', authenticator.authenticate,function(req, res) {
});



router.post("/register",function(req,res){
	console.log("register");
	user = req.body;
	password = user.password;
	user.password = passwordHash.generate(password);
	db.insert_to_table("users",user,res);
	
})
app.use('/api', router);
var server = app.listen(port,function(err,res){
	if(err)
	console.log(err);
});
server.timeout = 3000000;
console.log('Magic happens on port ' + port);