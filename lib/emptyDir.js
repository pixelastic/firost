const fs = require('fs-extra');
const isDirectory = require('./isDirectory');
const absolute = require('./absolute');

/**
 * Remove content of a directory
 * @param {string} userTarget Directory to empty
 * @returns {boolean} True on success, false on error
 **/
module.exports = async function emptyDir(userTarget) {
  const target = absolute(userTarget);
  if (!(await isDirectory(target))) {
    return false;
  }

  await fs.emptyDir(target);
  return true;
};
