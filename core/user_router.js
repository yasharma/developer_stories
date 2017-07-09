'use strict';
const path 	= require('path'),
multer      = require('multer'),
_ 			= require('lodash'),
config 		= require(require(path.resolve('./core/env')).getEnv),
fs 			= require('fs');

/* Require All the controllers */
let ctrls = {};
fs.readdirSync(path.resolve('./controllers/User')).forEach(file => {
	let name = file.substr(0,file.indexOf('.'));
	ctrls[name] = require(path.resolve(`./controllers/User/${name}`));
});


module.exports = {
  	routes: [
  		{ url: '/register', method: ctrls.userCtrl.register, type: 'post' },
	]
};