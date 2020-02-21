const fs = require('fs-extra');

/**
 * Check if a path exists
 * @param {string} target Path to check
 * @returns {boolean} true if exists, false otherwise
 **/
module.exports = async function exists(target) {
  return await fs.pathExists(target);
};
