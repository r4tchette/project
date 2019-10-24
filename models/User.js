var mongoose = require('mongoose');
var bcrypt = require("bcrypt-nodejs");

// schema
var userSchema = mongoose.Schema({
	id:{
		type:String,
		required:[true,"id is required!"],
		match:[/^.{4,12}$/,"Should be 4-12 characters!"],
		trim:true,
		unique:true
	},
	password:{
		type:String,
		required:[true,"Password is required!"],
		select:false
	},
	name:{
		type:String,
		required:[true,"Name is required!"],
		match:[/^.{4,12}$/,"Should be 4-12 characters!"],
		trim:true
	},
	email:{
		type:String,
		match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"Should be a vaild email address!"],
		trim:true
	},
	groups:[{
		type:mongoose.Schema.Types.ObjectId,
		ref:"group"
	}],
	posts:[{
		type:mongoose.Schema.Types.ObjectId,
		ref:"post",
		type:Number,
	}]
});

// hash password
userSchema.pre("save", function(next){
	var user = this;
	if(!user.isModified("password")){
		return next();
	} else{
		user.password = bcrypt.hashSync(user.password);
		return next();
	}
});

// model methods
userSchema.methods.authenticate = function(password){
	var user = this;
	console.log("input password : " + password);
	console.log("user password : " + user.password);
	if(user.password != null) return bcrypt.compareSync(password, user.password);
	else return false;
};

// model and export
var User = mongoose.model('user', userSchema);
module.exports = User;
