'use strict';
const 
	path 		= require('path'),
	response 	= require(path.resolve('core/lib/response')),
	User 		= require(path.resolve('models/User'));

exports.register = (req, res, next) => {
	if( !req.body.email || !req.body.password ){
		return res.status(response.STATUS_CODE.UNPROCESSABLE_ENTITY)
				.json(response.required({message: 'Email and Password is required'}));
	}
	
	let user = new User(req.body);
	user.save(function (err, user) {
		if( err ){
			return res.status(response.STATUS_CODE.UNPROCESSABLE_ENTITY)
						.json(response.error(err.errors));
		}
		res.json(response.success({success: true, user: user}));
	});
};