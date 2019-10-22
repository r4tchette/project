var express = require('express');
var router = express.Router();
var {check, validationResult} = require('express-validator');
var User = require('../models/User');
var Plant = require('../models/Plant');
var mongoose = require('mongoose');

// Index
router.get('/',
	function(req, res){
		var query = {};
		if(req.query.name) query.name = {$regex:req.query.name, $options:'i'};
		Plant.find(query)
		.sort({이름: 1})
		.exec(function(err, plants){
			if(err){
				res.status(500);
				res.json({success:false, message:err});
			} else{
				res.json({success:true, data:plants});
			}
		});
	}
);

// show
router.get('/:id',
	function(req, res, next){
		Plant.findOne({id:req.params.id})
		.exec(function(err, plant){
			if(err){
				res.status(500);
				res.json({success:false, message:err});
			} else if(!plant){
				res.json({success:false, message:"plant not found"});
			} else{
				res.json({success:true, data:plant});
			}
		});
	}
);

// search
router.post('/search',
	function(req, res, next){
		if(!req.body.name) return res.json({success:false, message:"plant name is required"});
		Plant.findOne({name:req.body.name})
		.exec(function(err, plant){
			if(err){
				res.status(500);
				res.json({success:false, message:err});
			} else if(!plant){
				res.json({success:false, message:"plant not found"});
			} else{
				res.json({success:true, data:plant});
			}
		});
	}
);

// comment
router.post('/comment',
	function(req, res, next){
		if(!req.body.name) return res.json({success:false, message:"plant name is required"});
		if(!req.body.author) return res.json({success:false, message:"author name is required"});
		User.findOne({id:req.body.author})
		.exec(function(err, user){
			if(err){
				res.status(500);
				res.json({success:false, message:err});
			} else if(!user){
				res.json({success:false, message:"user not found"});
			}
			else{
				res.locals.author = user._id;
				next();
			}
		})
	}, function(req, res, next){
		Plant.findOne({name:req.body.name})
		.exec(function(err, plant){
			if(err){
				res.status(500);
				res.json({success:false, message:err});
			} else if(!plant){
				res.json({success:false, message:"plant not found"});
			} else{
				next();
			}
		});
	}, function(req, res, next){
		var newComment = {
		//	'id': 0,
			'user': res.locals.author,
			'content': req.body.content,
		//	'date': Date.now,
		//	'like': 0
		};
		Plant.findOneAndUpdate({name:req.body.name}, {$push:{comments:newComment}})
		.exec(function(err, plant){
			if(err){
				res.status(500);
				res.json({success:false, message:err});
			} else{
				res.json({success:true, message:plant});
			}
		});
	}
);

// export
module.exports = router;
