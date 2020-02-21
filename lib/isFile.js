const fs = require('fs-extra');
const exists = require('./exists');

/**
 * Check if the specific path is a file
 * @param {string} userPath Path to check
 * @returns {boolean} If the path is a file
 **/
module.exports = async function isFile(userPath) {
  if (!(await exists(userPath))) {
    return false;
  }
  const stats = await fs.lstat(userPath);
  return stats.isFile();
};
