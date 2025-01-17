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
	mode: 'text',
//	mode: 'json',
	pythonPath: 'python3',
	pythonOptions: ['-u'],
	scriptPath: './py',
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
		cb(null, './images');
	},
	filename: function(req, file, cb){
		var extension = path.extname(file.originalname);
		var basename = path.basename(file.originalname, extension);
		cb(null, Date.now() + extension);	
	}
});

var storage_activity = multer.diskStorage({
	destination: function(req, file, cb){
		cb(null, './images_ActivityRep');
	},
	filename: function(req, file, cb){
		var extension = path.extname(file.originalname);
		var basename = path.basename(file.originalname, extension);
		cb(null, Date.now() + extension);
	}
});

var upload = multer({ storage: storage });
var upload_activity = multer({ storage: storage_activity });

// image upload to ./images_ActivityRep
router.post('/upload', upload_activity.single('image'), function(req, res, next){
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
	function(req, res){
		if(!req.file){
			return res.json({success:false, message:"file is required"});
		}
		var formData = { image : fs.createReadStream(req.file.path) };
		request.post({
			url:'http://localhost:5000/predict',
			formData: formData
		}, function(error, response, body){
			fs.unlink(req.file.path, err=>{
				if(err) throw err;
				console.log("successfully deleted " + req.file.path);
			});
			if(error){
				res.json({success:false, message: error});
				return console.error('upload failed: ', error);
			} else{
//				console.log(fs.unlink(req.file.path));
				console.log("이미지 검색 요청 처리");
				var obj = JSON.parse(body);
				console.log(obj);
				return res.json({success:true, data: obj});
			}
		});
	}
);

router.post('/request2', upload.single('image'),
	function(req, res){
		if(!req.file){
			return res.json({success:false, message:"file is required"});
		}
		console.log("options.args : " + options.args);
		console.log("req.file.path : " + req.file.path);
		options.args = req.file.path;
		console.log("options.args : " + options.args);
		PythonShell.run('main.py', options, function(err, results){
			if(err) throw err;
			console.log("results : " + results);
			console.log(JSON.parse(results));
			fs.unlink(req.file.path, (err)=>{
				if(err) throw err;
				console.log("successfully deleted " + req.file.path);
			});
			return res.json({success:true, data:JSON.parse(results)});
		})
	}
);

router.post('/show',
	function(req, res){
		var path = "./" + req.body.path;
		//console.log(path);
		var ext = (/[.]/.exec(path)) ? /[^.]+$/.exec(path) : undefined;
		if(ext != 'jpg' & ext != 'png'){
			console.log("checkout the file's extension");
			return res.json({success:false, message:"chekout the file's extentsion"});
		};
		fs.readFile(path, function(err, image){
			if(err){
				res.status(500);
				console.log(message.err);
				return res.json({success:false, message:err});
			} else{
				res.writeHead(200, {'Content_type': 'image/'+ext});
				res.end(image);
				console.log(req.body.path+" 파일 전송 성공");
			}
		});
	}
);

module.exports = router;
