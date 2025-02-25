import fs from 'fs-extra';
import { absolute } from './absolute.js';

/**
 * Check if a path exists
 * @param {string} userWhere Path to check
 * @param {object} userOptions Options to pass
 * @param {boolean} userOptions.ignoreEmptyFiles If set to true, considers empty
 * files as not existing
 * @returns {boolean} true if exists, false otherwise
 **/
export async function exists(userWhere, userOptions = {}) {
  const { ignoreEmptyFiles } = userOptions;
  const where = absolute(userWhere);
  const fileExistsOnDisk = await fs.pathExists(where);

  // No such file on disk
  if (!fileExistsOnDisk) {
    return false;
  }

  // If we don't need to check for empty files, then it exists
  if (!ignoreEmptyFiles) {
    return true;
  }

  // Check that file is not empty
  const stats = await fs.stat(where);
  return stats.size > 0;
}
