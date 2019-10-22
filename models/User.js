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
});/*, {
	toObject:{virtuals:true}
});*/

/*
// virtuals
userSchema.virtual("passwordConfirmation")
.get(function(){ return this._passwordConfirmation; })
.set(function(value){ this._passwordConfrimation = value; });

userSchema.virtual("originalPassword")
.get(function(){ return this._originalPassword; })
.set(function(value){ this._originalPassword = value; });

userSchema.virtual("currentPassword")
.get(function(){ return this._currentPassword; })
.set(function(value){ this._currentPassword = value; });

userSchema.virtual("newPassword")
.get(function(){ return this._newPassword; })
.set(function(value){ this._newPassword = value; });
*/

/*
//password validation
var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
var passwordRegexErrorMessage = "Should be minimum 8 characters of alphabet and number combination!";
userSchema.path("password").validate(function(v) {
	var user = this;

	// create user
	if(user.isNew){
		if(!user.passwordConfirmation){
			user.invalidate("passwordConfirmation", "Password Confrimation is required!");
		}
		if(!passwordRegex.test(user.password)){
			user.invalidate("password", passwordRegexErrorMessage);
		} else if(user.password !== user.passwordConfirmation){
			user.invalidate("passwordConfirmation", "Password Confirmation does not matched!");
		}
	}

	// update user
	if(!user.isNew){
		if(!user.currentPassword){
			user.invalidate("currentPassword", "Current Password is required!");
		}
		if(user.currentPassword && !bcrypt.compareSync(user.currentPassword, user.originalPassword)){
			user.invalidate("currentPassword", "Current Password is invalid!");
		}
		if(user.newPassword && !passwordRegex.test(user.newPassword)){
			user.invalidate("newPassword", passwordRegexErrorMessage);
		} else if(user.newPassword !== user.passwordConfirmation) {
			user.invalidate("passwordConfirmation", "Password Confirmation does not matched!");
		}
	}
});
*/

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
