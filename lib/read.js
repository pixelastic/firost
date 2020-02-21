const _ = require('golgoth/lib/_');
const fs = require('fs-extra');

/**
 * Read any file on disk
 * @param {string} filepath Filepath of the file to read
 * @returns {string} Content of the file read
 **/
module.exports = async function read(filepath) {
  const content = await fs.readFile(filepath);
  return _.trim(content.toString('utf8'));
};
