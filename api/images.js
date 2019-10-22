var express = require('express');
var router = express.Router();
var {PythonShell} = require('python-shell');
var multer = require('multer');
var path = require('path');

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
//		console.log(options.args);
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
		
		cb(null, basename + extension);
	}
});

var upload = multer({ storage: storage });

// image upload
router.post('/upload', upload.single('image'), function(req, res, next){
//	var name = req.body.name;
//	var ext = req.body.ext;
//	var image = req.file;
	var file = req.file;
	var result = {
		originalName: file.originalname,
		size : file.size
	}
	if(!file){
		return res.json({success:false, message:"file must be uploaded"});
	} else{
		return res.json({success:true, message:"upload success"});
	}
});

module.exports = router;
