const fs = require('fs-extra');
const absolute = require('./absolute');

/**
 * Check if the specific path is a symlink
 * @param {string} userWhere Path to check
 * @returns {boolean} If the path is a symlink
 **/
module.exports = async function isSymlink(userWhere) {
  const where = absolute(userWhere);

  // We don't directly check if the file exists, because it would follow the
  // symlinks and check if the target exists. Instead we'll just try to read its
  // stats and return false if we have an error that the file does not exist
  try {
    const stats = await fs.lstat(where);
    return stats.isSymbolicLink();
  } catch (err) {
    if (err.code == 'ENOENT') {
      return false;
    }
    throw err;
  }
};
