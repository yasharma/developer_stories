'use strict';


const path = require('path');

exports.getEnv = path.resolve(`./core/env/${process.env.NODE_ENV}`);