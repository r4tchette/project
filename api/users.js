var express = require("express");
var router = express.Router();
var User = require("../models/User");
var mongoose = require("mongoose");

// Index
router.get("/", 
	function(req, res){
		var query = {};
		if(req.query.id) query.id = {$regex:req.query.id, $options:'i'};

		User.find(query)
		.sort({email: 1})
		.exec(function(err, users){
			if(err){
				res.status(500);
				res.json({success:false, message:err});
			} else{
				res.json({success:true, data:users});
			}
		});
	}
);

// Show
router.get('/:id',
	function(req, res, next){
		User.findOne({id:req.params.id})
		.exec(function(err, user){
			if(err){
				res.status(500);
				res.json({success:false, message:err});
			} else if(!user){
				res.json({success:false, message:"user not found"});
			} else{
				res.json({success:true, data:user});
			}
		});
	}
);

// Create
router.post('/',
	function(req, res, next){
		User.findOne({id:req.body.id})
		.exec(function(err, user){
			if(err){
				res.status(500);
				return res.json({success, message:err});
			} else if(!user){
				next();
			} else{
				return res.json({success:false, message:"email already registered"});
			}
		});
	},
	function(req, res,next){
		var newUser = new User(req.body);
		newUser.save(function(err, user){
			if(err){
				res.status(500);
				res.json({success:false, message:err});
			} else{
				res.json({success:true, data:user});
			}
		});
	}
);
				
// Update
router.put('/:id',
	function(req, res, next){
		User.findOneAndUpdate({id:req.params.id}, req.body)
		.exec(function(err, user){
			if(err){
				res.status(500);
				res.json({success:false, message:err});
			} else if(!user){
				res.json({success:false, message:"user not found"});
			} else{
				res.json({success:true});
			}
		});
	}
);

// Destory
router.delete('/:id',
	function(req, res, next){
		User.findOneAndRemove({id:req.params.id})
		.exec(function(err, user){
			if(err){
				res.status(500);
				req.json({success:false, message:err});
			} else if(!user){
				res.json({success:false, message:"user not found"});
			} else{
				res.json({success:true});
			}
		});
	}
);

module.exports = router;
