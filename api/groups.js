var express = require("express");
var router = express.Router();
//var User = require("../models/User");
var Group = require("../models/Group");
var mongoose = require("mongoose");

// Index
router.get("/", 
	function(req, res){
		var query = {};
		if(req.query.id) query.id = {$regex:req.query.id, $options:'i'};

		Group.find(query)
		.sort({createdAt:1})
		.exec(function(err, groups){
			if(err){
				res.status(500);
				res.json({success:false, message:err});
			} else{
				res.json({success:true, data:groups});
			}
		});
	}
);

// Show
router.get('/:id',
	function(req, res, next){
		Group.findOne({id:req.params.id})
		.exec(function(err, group){
			if(err){
				res.status(500);
				res.json({success:false, message:err});
			} else if(!group){
				res.json({success:false, message:"group not found"});
			} else{
				res.json({success:true, data:group});
			}
		});
	}
);

// Create
router.post('/',
	function(req, res, next){
		Group.findOne({id:req.body.id})
		.exec(function(err, group){
			if(err){
				res.status(500);
				return res.json({success:false, message:err});
			} else if(!group){
				next();
			} else{
				return res.json({success:false, message:"group already existed"});
			}
		});
	},
	function(req, res, next){
		var newGroup = new Group(req.body);
		newGroup.save(function(err, group){
			if(err){
				res.status(500);
				res.json({success:false, message:err});
			} else{
				res.json({success:true, data:group});
			}
		});
	}
);
				
// Update
router.put('/:id',
	function(req, res, next){
		Group.findOneAndUpdate({id:req.params.id}, req.body)
		.exec(function(err, group){
			if(err){
				res.status(500);
				res.json({success:false, message:err});
			} else if(!group){
				res.json({success:false, message:"group not found"});
			} else{
				res.json({success:true});
			}
		});
	}
);

// Destory
router.delete('/:id',
	function(req, res, next){
		Group.findOneAndRemove({id:req.params.id})
		.exec(function(err, group){
			if(err){
				res.status(500);
				req.json({success:false, message:err});
			} else if(!group){
				res.json({success:false, message:"group not found"});
			} else{
				res.json({success:true});
			}
		});
	}
);

module.exports = router;
