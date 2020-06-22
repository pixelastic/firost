const fs = require('fs-extra');
const absolute = require('./absolute');

/**
 * Check if a path exists
 * @param {string} userWhere Path to check
 * @returns {boolean} true if exists, false otherwise
 **/
module.exports = async function exists(userWhere) {
  const where = absolute(userWhere);
  return await fs.pathExists(where);
};
