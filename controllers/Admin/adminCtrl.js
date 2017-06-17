'use strict';
const jwt 	 	= require('jsonwebtoken'),
	path 	 	= require('path'),
	crypto 	 	= require('crypto'),
	async 	 	= require('async'),
	_ 			= require('lodash'),
	mongoose 	= require('mongoose'),
	User 	 	= require(path.resolve('./models/User')),
	mail 	 	= require(path.resolve('./core/lib/mail')),
  	config 		= require(require(path.resolve('./core/env')).getEnv),
  	paginate    = require(path.resolve('./core/lib/paginate'));

exports.login = (req, res) => {
	if(!req.body.email || !req.body.password) {
		res.status(401).json({
			errors: {
				message: 'Email and password are required', 
				name: 'Authentication failed', 
				success: false,
			}	
		});
		return;
	}	

	User.findOne({ email: req.body.email }, {reset_password: 0, salt: 0},(err, user, next) => {
		if(err){
			next(err);                                              
		} else {
			let errors = {}, error = false;
			switch(_.isNull(user) || !_.isNull(user)){
				// 1. IF User Not Found in Database
				case _.isNull(user):
					errors = { name: 'Authentication failed', message: 'Authentication failed. User not found.', success: false};
					error = true;
					break;

				// 2. IF Admin has Deactivate User Account
				case (!user.status):
					errors = { name: 'Authentication failed', message: 'Your account is deactivated by admin, please contact admin.', success: false};
					error = true;
					break;

				default: 
					error = false;
			}
			
			if(error){
				res.status(401).json({ errors: errors });
			} else {
				if(user.comparePassword(config.salt, req.body.password)){
					// Remove sensitive data before sending user object
					user.password = undefined;
					let token = jwt.sign(user, new Buffer(config.secret).toString('base64'), {expiresIn: '1 day'});
					res.json({
						user: user, 
						token: token, 
						success: true, 
						message: 'login success'
					});
				} else {
					res.status(401).json({
						errors: {
							name: 'Authentication failed', 
							message: 'Authentication failed. Wrong password.',
							success: false	
						}
					});
				}
			}
		}
	});
};

exports.verifyEmail = (req, res, next) => {
	User.findOneAndUpdate(
		{ "salt": req.params.salt, "email_verified": false },
		{ "email_verified": true, "salt": null, "status": true },
		{ new: true, runValidators: true, setDefaultsOnInsert: true, fields: {email: 1} },
		function(err, user){
    		if(err || !user){
    			// to-do should be redirect on expired or invalid link page
    			if(process.env.NODE_ENV === 'test'){
    				return res.sendStatus(400);
    			}
    			res.redirect('/#/invalid-email-link');
    		} else {
    			if(process.env.NODE_ENV === 'test'){
    				return res.sendStatus(200);
    			}
    			// to-do should be redirect on user dashboard with success message
				res.redirect('/#/login?emailVerified=true');
    		}
    	}
    );
};

exports.register = function(req, res, next) {
	let adminUser = config.defaultAdmin;
	async.waterfall([
		// check if default admin already created
		function (done) {
			User.count({email: adminUser.email}, function (err, count) {
				done(err, count);
			});
		},
		function (count, done) {
			if(count > 0){
				done(null, true);
			} else {
				let user = new User(adminUser);
				user.save(function(err, user) {
					done(err, user);
				});
			}
		}
	],function(err, user) {
		if(err){
			console.log(err);
		}
	});
};

/**
 * Forgot for reset password (forgot POST)
 */
exports.forgot = (req, res, next) => {
	if(!req.body || !req.body.email){
		res.status(400).json({
			message: 'Email field is required', 
			success: false
		});
		return;
	}
	async.waterfall([
		// find the user
		function(done){
			User.findOne({ email: req.body.email, role: { $ne: "admin" } }, 'email email_verified deactivate status',function(err, user){
				if(err){
					done(err, null);
				} else {
					let errors = null, error = false;
					switch(_.isNull(user) || !_.isNull(user)){
						// 1. IF User Not Found in Database
						case _.isNull(user):
							errors = { name: 'Authentication failed', message: 'No account with that email has been found', success: false};
							error = true;
							break;

						// 2. IF User Email is Not Verified
						case (!user.email_verified):
							errors = { name: 'Authentication failed', message: 'Your email is not verified, kindly verify your email.', success: false};
							error = true;
							break;

						// 3. IF User has deactivate his account
						case (user.deactivate):
							errors = { name: 'Authentication failed', message: 'Your account is deactivate.', success: false};
							error = true;
							break;

						// 4. IF Admin has Deactivate User Account
						case (!user.status && user.email_verified):
							errors = { name: 'Authentication failed', message: 'Your account is deactivated by admin, please contact admin.', success: false};
							error = true;
							break;

						default: 
							error = false;
					}
					done(errors, user);
				}
			});
		},
		// Generate random token
		function (user, done) {
			crypto.randomBytes(20, function (err, buffer) {
				let token = buffer.toString('hex');
	        	done(err, user, token);
	      	});
	    },
	    // Lookup user by email
	    function (user, token, done) {
			User.update(
				{_id: user._id},
				{ reset_password: { token: token, timestamp: Date.now() + 86400000, status: true} }, 
				{ runValidators: true, setDefaultsOnInsert: true },
				function(err, result){
					done(err, token, user, result);
				}
			);
	    },
		// If valid email, send reset email using service
		function(token, user, done){
			let baseUrl = `${req.protocol}://${req.headers.host}`;
			mail.send({
				subject: 'Reset your password',
				html: './public/mail/user/reset-password.html',
				from: config.mail.from, 
				to: user.email,
				emailData : {
		   		    url: `${baseUrl}/reset/${token}`
		   		}
			}, function(err, success){
				if(err){
					res.status(500).json({
						source: err,
						message: 'Failure sending email',
						success: false
			        });
				} else {
					res.json({
						success: true,
		        		message: 'An email has been sent to the provided email with further instructions.'	
			        });
				}
			});
		}
	], function (err) {
		if(err){
			res.status(500).json( err );
		}
	});
};

/**
 * Reset password GET from email token
 */
exports.validateResetToken = (req, res, next) => {
	User.count({ "reset_password.token": req.params.token, "reset_password.timestamp": { $gt: Date.now() }, "reset_password.status": true } , function(err, user){
    	if(user === 0){
    		if(process.env.NODE_ENV === 'test'){
    			return res.sendStatus(400);
    		}
    		return res.redirect('/#/invalid-password');
    	} else {
	    	if(process.env.NODE_ENV === 'test'){
				return res.sendStatus(200);
			}
			res.redirect(`/#/reset/${req.params.token}`);	
    	}
    });
};

/**
 * Reset password POST from email token
 */
exports.reset = function (req, res, next) {

	async.waterfall([
		function(done){
			User.findOne(
				{ "reset_password.token": req.params.token, "reset_password.timestamp": { $gt: Date.now() }, "reset_password.status": true }, 
				{email: 1, password: 1, reset_password: 1, firstname:1},
				function(err, user){
					if(!err && user){
						user.password = req.body.password;
						user.reset_password = {
							status: false
						};
						user.save(function(err, saved){
							if(err){
								return next(err);
							} else {
								// Remove sensitive data before return authenticated user
	                    		user.password = undefined;
								res.json({
									success: true,
									message: 'Password has been changed successfully.'
								});
								done(err, user);
							}
						});
					} else {
						res.status(400).json({
							source: err,
							success: false,
			        		message: 'Password reset token is invalid or has been expired.'	
				        });
					}	
				}
			);	
		},
		function(user, done){
			mail.send({
				subject: 'Your password has been changed',
				html: './public/mail/user/reset-password-confirm.html',
				from: config.mail.from, 
				to: user.email,
				emailData : {
					firstname: user.firstname || 'User'
				}
			},done);
		}
	], function (err) {
		if (err) {
			return next(err);
		}
	});
};

/**
 * get user profile 
 */
exports.profileById = function (req, res, next) {
	User.findById(req.params.id,'-reset_password -salt -auth -i -password -last_edited_by',(error, profileUser) => {
        if(profileUser){
            res.json({ 
				record: profileUser, 
				success: true, 
				message: 'success'
			});		
        } else {
            res.json({
            	message: 'No user found.',
            	success: false	
            });
        }
    });
};