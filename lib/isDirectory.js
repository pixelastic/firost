import fs from 'fs-extra';
import exists from './exists';

/**
 * Check if the specific path is a directory
 * @param {string} userPath Path to check
 * @returns {boolean} If the path is a directory
 **/
const module = async function isDirectory(userPath) {
  if (!(await exists(userPath))) {
    return false;
  }
  const stats = await fs.lstat(userPath);
  return stats.isDirectory();
};

export default module;
