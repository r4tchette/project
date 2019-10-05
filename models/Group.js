var mongoose = require("mongoose");

// Schema
var groupSchema = mongoose.Schema({
	id: {
		type:String, 
		required:[true, "Group name is required"]
	},
	admin: {
		type:mongoose.Schema.Types.ObjectId, 
		ref:"user", 
		required:true},
	member:[{
		type:mongoose.Schema.Types.ObjectId, 
		ref:"user"
	}],
	post:[{
		type:mongoose.Schema.Types.ObjectId, 
		ref:"post"
	}],
	description:{
		type:String,
	},
	createdAt:{
		type:Date, 
		default:Date.now
	}
});

// Model and Export
var Group = mongoose.model("group", groupSchema);
module.exports = Group;
