const fs = require('fs-extra');
const exists = require('./exists');
const absolute = require('./absolute');

/**
 * Check if the specific path is a file, or a link to a file
 * @param {string} userWhere Path to check
 * @returns {boolean} If the path is a file
 **/
module.exports = async function isFile(userWhere) {
  const where = absolute(userWhere);
  if (!(await exists(where))) {
    return false;
  }
  const stats = await fs.stat(where);
  return stats.isFile();
};
