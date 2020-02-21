const fs = require('fs-extra');

/**
 * Create directories recursively
 * @param {string} dirPath Directory path to create
 **/
module.exports = async function mkdirp(dirPath) {
  await fs.mkdirp(dirPath);
};
