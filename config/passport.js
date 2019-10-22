var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var User = require("../models/User");

// seralize & deserialize User
passport.serializeUser(function(user, done){
	done(null, user.id);
});
passport.deserializeUser(function(id, done){
	User.findOne({_id:id}, function(err, user){
		done(err, user);
	});
});

// local strategy
passport.use("local-login",
	new LocalStrategy({
		usernameField : "id",
		passwordField : "password",
		passReqToCallback : true
	}, function(req, id, password, done){
		User.findOne({id:req.body.id})
		.select({password:1})
		.exec(function(err, user){
			if(err) return done(err);
			if(user && user.authenticate(req.body.password)){
//				return res.json({success:true, data:user});
				return done(null, user);
			} else{
//				req.flash("id", id);
//				req.flash("errors", {login:"Incorrect username or password"});
//				res.status(500);
//				return res.json({success:false, message:"Incorrect username or password"});
				return done(null, false);
			}
		});
	})
);

module.exports = passport;
