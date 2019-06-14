import fs from 'fs-extra';
import exists from './exists';

/**
 * Check if the specific path is a file
 * @param {String} userPath Path to check
 * @returns {Boolean} If the path is a file
 **/
const module = async function isFile(userPath) {
  if (!(await exists(userPath))) {
    return false;
  }
  const stats = await fs.lstat(userPath);
  return stats.isFile();
};
export default module;
