import fs from 'fs-extra';
import exists from './exists.js';
import absolute from './absolute.js';

/**
 * Check if the specific path is a directory
 * @param {string} userWhere Path to check
 * @returns {boolean} If the path is a directory
 **/
export default async function isDirectory(userWhere) {
  const where = absolute(userWhere);
  if (!(await exists(where))) {
    return false;
  }
  const stats = await fs.stat(where);
  return stats.isDirectory();
}
