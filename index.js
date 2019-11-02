require("dotenv").config();
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var passport = require('./config/passport');
var app = express();

// Database
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.connect(process.env.MONGODB);
var db = mongoose.connection;
db.once("open", function(){
	console.log("Succesfully connected to the mongodb server.");
});
db.on("error", function(err){
	console.log("Unable to connect to the mongodb server. Error : ", err);
});

// Passport
app.use(passport.initialize());
//app.use(passport.session());

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	res.header('Access-Control-Allow-Headers', 'content-type');
	next();
});


// API
app.use('/api/users', require('./api/users'));
app.use('/api/groups', require('./api/groups'));
app.use('/api/posts', require('./api/posts'));
app.use('/api/plants', require('./api/plants'));
app.use('/api/images', require('./api/images'));
app.use('/api/activities', require('./api/activities')); //원예 활동 및 기록 관리 API. 구현 중

// Port setting
var port = 3000
app.listen(port, function(){
	console.log("Service is running on port https://localhost:" + port);
});
