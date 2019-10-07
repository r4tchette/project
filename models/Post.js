var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
	id:{
		type:Number,
		unique:true
	},
	title:{
		type:String,
		required:[true, "title is required"],
	},
	body:{
		type:String,
		required:[true,"body is required!"],
	},
	group:{
		type:mongoose.Schema.Types.ObjectId,
		ref:"group",
		required:true
	},
	author:{
		type:mongoose.Schema.Types.ObjectId,
		ref:"user",
		required:true
	},
	createdAt:{
		type:Date,
		default:Date.now()
	},
	updatedAt:{
		type:Date
	}
});

var Post = mongoose.model('post', postSchema);
module.exports = Post;
