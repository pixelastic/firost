const tempDir = require('temp-dir');
const uuid = require('./uuid');
const path = require('path');
/**
 * Return the path to a temporary folder
 * @param {string} scope Optional subdirectories in the tmp folder
 * @returns {string} Filepath to the temp directory
 **/
module.exports = function (scope = '') {
  return scope
    ? path.resolve(tempDir, scope, uuid())
    : path.resolve(tempDir, uuid());
};
