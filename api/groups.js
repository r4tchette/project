var express = require("express");
var router = express.Router();
var User = require("../models/User");
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

// register
router.post('/register',
	function(req, res, next){
		var errors = {};
		var isValid = true;
		if(!req.body.id){
			isValid = true;
			errors.id = "Group name is required";
		}
		if(!req.body.admin){
			isValid = false
			errors.password = "Admin id is required";
		}

		if(isValid){
			Group.findOne({id:req.body.id})
			.exec(function(err, group){
				if(err){
					res.status(500);
					return res.json({success:false, message:err});
				} else if(!group){
					next();
				} else{
					return res.json({success:false, message:"group name is already used"});
				}
			});
		} else{
			res.json({success:false, message:errors});
		}
	}, function(req, res, next){
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


// invite
router.post('/invite',
	function(req, res, next){
		var errors = {};
		if(!req.body.userid){
			return res.json({succsss:false, message:"userid is required"});
		}
		if(!req.body.groupid){
			return res.json({success:false, message:"groupid is required"});
		}
		User.findOne({id:req.body.userid})
		.exec(function(err, user){
			if(err){
				res.status(500);
				return res.json({success:false, message:err});
			} else{
				res.locals.user_id = user._id;
				//next();
			}
		});
		Group.findOne({id:req.body.groupid})
		.exec(function(err, group){
			if(err){
				res.status(500);
				return res.json({success:false, message:err});
			} else{
				console.log("1 : " + group);
				next();
			}
		});
	}, function(req, res, next){
		Group.findOneAndUpdate({id:req.body.groupid}, {$push:{member:res.locals.user_id}})
		.exec(function(err, group){
			if(err){
				res.status(500);
				res.json({success:false, message:err});
			} else{
				console.log("2 : " + group);
				res.json({success:true, data:group});
			}
		});
	}
);

// get by _id
router.post('/getby_id',
	function(req, res, next){
		if(!req.body._id){
			res.status(422);
			return res.json({success:false, message:"_id is required"});
		}
		Group.findOne({_id:req.body._id})
		.exec(function(err, group){
			if(err){
				res.status(500);
				res.json({success:false, message:err});
			} else{
				res.json({success:true, data:group});
			}
		});
	}
);

module.exports = router;
