const _ = require('golgoth/lodash');
const fs = require('fs-extra');
const absolute = require('./absolute');

/**
 * Read any file on disk, synchronously
 * @param {string} userFilepath Filepath of the file to read
 * @returns {string} Content of the file read
 **/
module.exports = function read(userFilepath) {
  const filepath = absolute(userFilepath);
  const content = fs.readFileSync(filepath);
  return _.trim(content.toString('utf8'));
};
