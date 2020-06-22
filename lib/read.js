const _ = require('golgoth/lib/_');
const fs = require('fs-extra');
const absolute = require('./absolute');

/**
 * Read any file on disk
 * @param {string} userFilepath Filepath of the file to read
 * @returns {string} Content of the file read
 **/
module.exports = async function read(userFilepath) {
  const filepath = absolute(userFilepath);
  const content = await fs.readFile(filepath);
  return _.trim(content.toString('utf8'));
};
