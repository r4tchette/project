var mongoose = require('mongoose');

// schema

var activityRecordSchema = mongoose.Schema({
	name_activity:{ type:String, required:true }, // 활동 id
	name_record:{ type:String, required:true }, // 기록 제목
	writer:{ type:String, required:true }, // 작성자
	date_recorded:{ type:Date, required:true }, // 기록 작성 일자
	time_start:Date, // 활동 시작 일시
	time_close:Date, // 활동 종료 일시
	participant:[String], // 참여자
	image:{ data: Buffer, contentType:String }, // 대표 이미지
	content:String, // 기록 내용
});

// modeling and export
var activityRecordModel = mongoose.model('activity_records', activityRecordSchema);
module.export = activityRecordModel;

