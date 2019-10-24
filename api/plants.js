var express = require('express');
var router = express.Router();
var {check, validationResult} = require('express-validator');
var User = require('../models/User');
var Plant = require('../models/Plant');
var mongoose = require('mongoose');
var fs = require('fs');

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
		if(!req.body.name || !req.body.author || !req.body.content)
			return res.json({success:false, message:"name, author, content fields are required"});
		User.findOne({id:req.body.author})
		.exec(function(err, user){
			if(err){
				res.status(500);
				return res.json({success:false, message:err});
			} else if(!user){
				return res.json({success:false, message:(req.body.author + " : user not found")});
			} else{
				res.locals.author = user._id;
			}
		});
		Plant.findOne({name:req.body.name})
		.exec(function(err, plant){
			if(err){
				res.status(500);
				return res.json({success:false, message:err});
			} else if(!plant){
				return res.json({success:false, message:(req.body.name + " : plant not found")});
			}
		});
		var newComment = {
			'id': 0,
			'author': res.locals.author,
			'content': req.body.content,
			'date': Date.now(),
			'like': 0
		};
		Plant.findOneAndUpdate({name:req.body.name}, {$push:{comments:newComment}})
		.exec(function(err, plant){
			if(err){
				res.status(500);
				return res.json({succcess:false, message:err});
			}
		});
		Plant.findOne({name:req.body.name})
		.exec(function(err, plant){
			if(err){
				res.status(500);
				return res.json({success:false, message:err});
			} else{
				return res.json({success:true, message:plant});
			}
		});
	}
);

router.post('/image',
	function(req, res){
		var path = "./images/" + req.body.name + ".";
		var ext = "png";

		fs.readFile(path+ext, function(err, image){
			if(err){
				res.json({message:err});
			}
				//res.status(500);
				//res.json({success:false, message:err});
			else{
				//res.json({success:true, data:image});
				res.writeHead(500, {'Content_type': 'image/'+ext});
				res.end(image);
			}
//			res.writeHead(200, {'Content-Type': 'image/png'});
//			res.write(image);
//			res.end();
		});
		fs.readFile(path+"jpg", function(err, image){
			if(err){
				res.status(500);
				res.json({success:false, message:err});
			} else{
				res.writeHead(500, {'Content_type': 'image/jpg'});
				res.end(image);
			}
		});
});
/*		fs.readFile(path, 'binary', function(err, image){
			if(err){
				res.status(500);
				res.json({success:false, message:err});
			} else{
				res.json({success:true, data:image});
			}
		});
	}
	*/

// export
module.exports = router;
