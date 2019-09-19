/* eslint-disable import/no-commonjs, no-global-assign */
/**
 * This file is used as a proxy to replace the builtin `require` calls used in
 * our custom `firost.require` method to use esm. esm allows using import syntax
 * in our files without needing to build them through babel first.
 * This is what allows firost.require() to correctly load ES5 or ES6 files using
 * import
 * See https://github.com/standard-things/esm for more information
 **/
require = require('esm')(module);
module.exports = require('./require.js');
