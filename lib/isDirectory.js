const fs = require('fs-extra');
const exists = require('./exists');
const absolute = require('./absolute');

/**
 * Check if the specific path is a directory
 * @param {string} userWhere Path to check
 * @returns {boolean} If the path is a directory
 **/
module.exports = async function isDirectory(userWhere) {
  const where = absolute(userWhere);
  if (!(await exists(where))) {
    return false;
  }
  const stats = await fs.lstat(where);
  return stats.isDirectory();
};
