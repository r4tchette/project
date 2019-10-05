require("dotenv").config();
var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

// Database
mongoose.connect(process.env.MONGODB);
var db = mongoose.connection;
db.once("open", function(){
	console.log("Succesfully connected to the mongodb server.");
});
db.on("error", function(err){
	console.log("Unable to connect to the mongodb server. Error : ", err);
});

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
app.use("/api/users", require("./api/users"));
app.use("/api/groups", require("./api/groups"));

// Port setting
var port = 3000
app.listen(port, function(){
	console.log("Service is running on port https://localhost:" + port);
});
