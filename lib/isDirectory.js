import fs from 'fs-extra';
import { absolute } from './absolute.js';
import { callerDir } from './callerDir.js';
import { exists } from './exists.js';

/**
 * Check if the specific path is a directory
 * @param {string} userWhere Path to check
 * @returns {boolean} If the path is a directory
 **/
export async function isDirectory(userWhere) {
  const where = absolute(userWhere, { cwd: callerDir() });
  if (!(await exists(where))) {
    return false;
  }
  const stats = await fs.stat(where);
  return stats.isDirectory();
}
