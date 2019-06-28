import fs from 'fs-extra';
import isDirectory from './isDirectory';

/**
 * Remove content of a directory
 * @param {string} target Directory to empty
 * @returns {boolean} True on success, false on error
 **/
const module = async function emptyDir(target) {
  if (!(await isDirectory(target))) {
    return false;
  }

  await fs.emptyDir(target);
  return true;
};
export default module;