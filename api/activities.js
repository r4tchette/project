// 원예 활동 및 기록 관리 처리 API

// 관련 모듈 import
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Activity = require('../models/Activity'); 
var activityRecord = require('../models/activityRecord');

//----------------------------------------------------------------------

/**
 * POST 방식으로 전달되는 요청 객체 속성
 * name_activity :
 * created_at
 * ended_at
 * name_plant
 * id_manager
 * id_participants
 * image
 * sensor
*/

//원예 활동 컬렉션에 활동 정보 db 객체 추가 함수
router.post('/register',
	function(req, res,next){
		var errors = {};
		var isValid = true;
		/**
		if(!req.body.name_activity) {
			isValid = false;
			errors.err_no_act_name = "Activity name is required";
		}

		if(!req.body.created_at) {
			isValid = false;
			errors.no_created_date = "Created date is required!";
		}

		if(!req.body.id_manager) {
			isValid = false;
			errors.no_manager_id = "Manager id is required!";
		}
		**/

		if(isValid) {
			Activity.findOne({name_activity:req.body.name_activity})
			.exec(function(err, activity){
				if(err){
					res.status(500);
					return res.json({success:false, message:err});
				} else if(!activity){
					next();
				} else{
					return res.json({success:false, message:"이미 존재하는 활동명입니다"});
				}
			});
		} else {
			res.json({success:false, novalue:errors});
		}
	}, function(req, res, next){
		var newActivity = new Activity(req.body);
		newActivity.save(function(err, activity){
			if(err){
				res.status(500);
				res.json({success:false, message:err});
			} else{
				console.log("Activity DB object insertion success");
				console.log(activity);
				res.json({success:true, data:activity});
			}
		});
	}
);

// 원예 활동 컬렉션에 특정 활동 정보 db 객체 수정
router.post('/update',
	function(req, res,next){
		var errors = {};
		var isValid = true;
		
		if(!req.body.name_activity) {
			isValid = false;
			errors.id = "Activity name is required";
		}

		if(!req.body.created_at) {
			isValid = false;
			errors.id = "Created date is required!";
		}

		if(!req.body.id_manager) {
			isValid = false;
			errors.id  = "Manager id is required!";
		}

		if(isValid) {
			Activity.findOne({name_activity:req.body.name_activity})
			.exec(function(err, activity){
				if(err){
					res.status(500);
					return res.json({success:false, message:err});
				} else if(!activity){
					next();
				} else{
					return res.json({success:false, message:"activity name is already used"});
				}
			});
		} else {
			res.json({success:false, message:errors});
		}
	}, function(req, res, next){
		var newActivity = new Activity(req.body);
		newActivity.save(function(err, activity){
			if(err){
				res.status(500);
				res.json({success:false, message:err});
			} else{
				res.json({success:true, data:activity});
			}
		});
	}
);

// 원예 활동 컬렉션에 저장된 참여하고 있는 모든 활동 정보 db 객체 조회
router.post('/searchall',
	function(req, res){
		Activity.find({id_manager:req.body.id_manager})
			.exec(function(err, activity){
				if(err){
					res.status(500);
					return res.json({success:false, message:err});
				} else if(activity.length == 0){
					return res.json({success:false, message:"활동 기록 존재하지 않음"});
				} else{
					console.log("DB에서 "+req.body.id_manager+"의 참여 중인 원예 활동 정보 조회함");
					return res.json({success:true, data:activity});
				}
			});
	}
);
// 원예 활동 기록 컬렉션에 활동 기록 db 객체 추가

// 원예 활동 기록 컬렉션의 특정 활동 기록 db 객체 수정

// 원예 활동 기록 컬렉션에서 특정 활동의 모든 활동 기록 db 객체  조회

// 원예 활동 기록 컬렉션에서 특정 활동의 조건에 맞는 활동 기록 db 객체 조회

//----------------------------------------------------------------------

module.exports = router;
