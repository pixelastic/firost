import fs from 'fs-extra';
import { absolute } from './absolute.js';
import { callerDir } from './callerDir.js';
import { exists } from './exists.js';

/**
 * Check if the specific path is a file, or a link to a file
 * @param {string} userWhere Path to check
 * @returns {boolean} If the path is a file
 **/
export async function isFile(userWhere) {
  const where = absolute(userWhere, { cwd: callerDir() });
  if (!(await exists(where))) {
    return false;
  }
  const stats = await fs.stat(where);
  return stats.isFile();
}
