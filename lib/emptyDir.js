const fs = require('fs-extra');
const isDirectory = require('./isDirectory');

/**
 * Remove content of a directory
 * @param {string} target Directory to empty
 * @returns {boolean} True on success, false on error
 **/
module.exports = async function emptyDir(target) {
  if (!(await isDirectory(target))) {
    return false;
  }

  await fs.emptyDir(target);
  return true;
};
