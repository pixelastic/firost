const fs = require('fs-extra');
const exists = require('./exists');

/**
 * Check if the specific path is a directory
 * @param {string} userPath Path to check
 * @returns {boolean} If the path is a directory
 **/
module.exports = async function isDirectory(userPath) {
  if (!(await exists(userPath))) {
    return false;
  }
  const stats = await fs.lstat(userPath);
  return stats.isDirectory();
};
