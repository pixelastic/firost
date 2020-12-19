const fs = require('fs-extra');
const absolute = require('./absolute');

/**
 * Check if a path exists
 * @param {string} userWhere Path to check
 * @param {object} userOptions Options to pass
 * @param {boolean} userOptions.ignoreEmptyFiles If set to true, considers empty
 * files as not existing
 * @returns {boolean} true if exists, false otherwise
 **/
module.exports = async (userWhere, userOptions = {}) => {
  const { ignoreEmptyFiles } = userOptions;
  const where = absolute(userWhere);
  const exists = await fs.pathExists(where);

  // If not found or if we don't need to check for filesize, we can return early
  if (!exists || !ignoreEmptyFiles) {
    return exists;
  }

  // Check that file is not empty
  const stats = await fs.stat(where);
  return stats.size > 0;
};
