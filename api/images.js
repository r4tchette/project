var express = require('express');
var router = express.Router();
var {PythonShell} = require('python-shell');
var multer = require('multer');
var path = require('path');
var request = require('request');
var FormData = require('form-data');
var fs = require('fs');

// python shell option
var options = {
	mode: 'json',
	pythonPath: 'python3',
	pythonOptions: ['-u'],
	scriptPath: './py'
};

// run python shell
router.post('/search',
	function(req, res, next){
		if(!req.body.search){
			res.status(500);
			return res.json({success:false, message:"search field must be filled"});
		}
//		console.log(options.args);
		options.args = req.body.search;
		console.log(options.args);
		PythonShell.run('main.py', options, function(err, results){
			if(err) throw err;
			console.log("pyton shell is running successfully");
			console.log(results);
			return res.json({success:true, data:results});
		})
	}
);

// multer option
var storage = multer.diskStorage({
	destination: function(req, file, cb){
		cb(null, './py/uploads/');
	},
	filename: function(req, file, cb){
		var extension = path.extname(file.originalname);
		var basename = path.basename(file.originalname, extension);
		cb(null, Date.now() + extension);	
	}
});

var upload = multer({ storage: storage });

// image upload
router.post('/upload', upload.single('image'), function(req, res, next){
	var file = req.file;
	//console.log(req.file);
	if(!req.file){
		return res.json({success:false, message:"file must be uploaded"});
	} else{
		return res.json({success:true, data:req.file});
	}
});

// integration with flask server for image classification
// send post request via multipart/form-data
router.post('/request', upload.single('image'),
	function(req, res, next){
		if(!req.file){
			return res.json({success:false, message:"file is required"});
		}
		var formData = { image : fs.createReadStream(req.file.path) };
		request.post({
			url:'http://localhost:5000/predict',
			formData: formData
		}, function(error, response, body){
			if(error){
				res.json({success:false, message: error});
				return console.error('upload failed: ', error);
			}
//			console.log(response);
			var obj = JSON.parse(body);
			return res.json({success:true, data: obj});
		});
	}
);

module.exports = router;
