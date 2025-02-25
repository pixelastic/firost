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
  const pathExists = await fs.pathExists(where);

  // If not found or if we don't need to check for filesize, we can return early
  if (!pathExists || !ignoreEmptyFiles) {
    return exists;
  }

  // Check that file is not empty
  const stats = await fs.stat(where);
  return stats.size > 0;
}
