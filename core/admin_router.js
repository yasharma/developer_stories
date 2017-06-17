'use strict';
const path 	= require('path'),
multer      = require('multer'),
_ 			= require('lodash'),
config 		= require(require(path.resolve('./core/env')).getEnv),
fs 			= require('fs');

/* Require All the controllers */
let ctrls = {};
fs.readdirSync(path.resolve('./controllers/Admin')).forEach(file => {
	let name = file.substr(0,file.indexOf('.'));
	ctrls[name] = require(path.resolve(`./controllers/Admin/${name}`));
});


module.exports = {
  	routes: [
  		{ url: '/login', method: ctrls.adminCtrl.login, type: 'POST' },
  		{ url: '/profile/:id', method: ctrls.profileCtrl.updateAccount, type: 'PUT' },
  		{ url: '/change_password/:id', method: ctrls.profileCtrl.changePassword, type: 'PUT' }
	]
};