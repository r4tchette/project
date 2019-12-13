var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('request');
var fs = require('fs');

//request to delete file
router.post('/delete', function(req, res) {
	fs.unlink(req.body.path, (err) => {
		if(err) { res.json({success:false, path:req.body.path}); throw err; }
		console.log("successfully deleted " + req.body.path);
		res.json({success:true, path:req.body.path});
		}
	)}
);

module.exports = router;

