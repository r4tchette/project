var express = require('express');
var router = express.Router();
var {check, validationResult} = require('express-validator');
var Post = require('../models/Post');
var User = require('../models/User');
var mongoose = require('mongoose');

// Index
router.get('/', 
	function(req, res){
		var query = {};
		if(req.query.id) query.id = {$regex:req.query.id, $options:'i'};
		Post.find(query)
		.sort({id: 1})
		.exec(function(err, posts){
			if(err){
				res.status(500);
				res.json({success:false, message:err});
			} else{
				res.json({success:true, data:posts});
			}
		});
	}
);

// Show
router.get('/:id',
	function(req, res, next){
		Post.findOne({id:req.params.id})
		.exec(function(err, post){
			if(err){
				res.status(500);
				res.json({success:false, message:err});
			} else if(!post){
				res.json({success:false, message:"post not found"});
			} else{
				res.json({success:true, data:post});
			}
		});
	}
);

// Create
router.post('/',[
                check('body').isLength({min:1}),
                check('title').isLength({min:1})
	],
	function(req, res, next){
		const errors = validationResult(req);
		if(!errors.isEmpty()){
			return res.status(422).json({success:false, message: errors.array()});
		}
		Post.findOne({})
		.sort({id:-1})
		.exec(function(err, post){
			if(err){
				res.status(500);
				return res.json({success, message:err});
			} else{
				res.locals.lastId = (post?post.id:0)+1;
				next();
			}
		});
	},
	function(req, res, next){
                //console.log("!#!#!@#@#!#!\n");
                //console.log(res.locals.lastId);
                User.findOneAndUpdate({'_id':req.body.author}, {'$push': {'posts': res.locals.lastId + 1}})
                .exec(function(err, user){
                        if(err){
                                res.status(500);
                                return res.json({success:false, message:err});
                        } else{
				next();
                        }
                });
        },
	function(req, res, next){
		var newPost = new Post(req.body);
		newPost.id = res.locals.lastId;
		newPost.save(function(err, post){
			if(err){
				res.status(500);
				res.json({success:false, message:err});
			} else{
				res.json({success:true, data:post});
				next();
			}
		});
	}
);
				
// Update
router.put('/:id', [
		check('body').isLength({min:1}),
		check('title').isLength({min:1})
	],
	function(req, res, next){
		const errors = validationResult(req);
		if(!errors.isEmpty()){
			return res.status(422).json({success:false, message: errors.array()});
		}
		Post.findOneAndUpdate({id:req.params.id}, req.body)
		.exec(function(err, post){
			if(err){
				res.status(500);
				res.json({success:false, message:err});
			} else if(!post){
				res.json({success:false, message:"post not found"});
			} else{
				res.json({success:true});
			}
		});
	}
);

// Destory
router.delete('/:id',
	function(req, res, next){
		Post.findOneAndRemove({id:req.params.id})
		.exec(function(err, post){
			if(err){
				res.status(500);
				req.json({success:false, message:err});
			} else if(!post){
				res.json({success:false, message:"post not found"});
			} else{
				res.json({success:true});
			}
		});
	}
);

module.exports = router;
