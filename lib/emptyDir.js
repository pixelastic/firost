import fs from 'fs-extra';
import isDirectory from './isDirectory';

/**
 * Remove content of a directory
 * @param {String} target Directory to empty
 * @returns {Void}
 **/
const module = async function emptyDir(target) {
  if (!(await isDirectory(target))) {
    return false;
  }

  await fs.emptyDir(target);
  return true;
};
export default module;
