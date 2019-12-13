var mongoose = require('mongoose');
var fs = require('fs');


// 활동 참가자 스키마
//var ParticipantSchema = mongoose.Schema({
//	id:{ type:String, required:true}, // 참가자 id
//	joined_at:{ type:Date, required:true }, // 참여 일자
//	leaved_at:Date // 참여 종료 일자 
//});
		
// 활동 스키마
var ActivitySchema = mongoose.Schema({
	name_activity: { type:String, unique:true, required: true }, // 활동명
	created_at: { type: String, required: true }, // 활동 시작 일시
	ended_at:String, // 활동 종료 일시
	name_plant:String, // 식물명
	id_manager:{ type:String, required:true }, // 팀장 id 
	id_participants:String, // 참가자 id
	imgPath: { type:String, required: true }
	//sensor:String // 실시간 탐지 센서
});



// modeling and export
var Activity = mongoose.model('activities', ActivitySchema);
module.exports = Activity;

