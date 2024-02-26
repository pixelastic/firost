import fs from 'fs-extra';
import isDirectory from './isDirectory.js';
import absolute from './absolute.js';

/**
 * Remove content of a directory
 * @param {string} userTarget Directory to empty
 * @returns {boolean} True on success, false on error
 **/
export default async function emptyDir(userTarget) {
  const target = absolute(userTarget);
  if (!(await isDirectory(target))) {
    return false;
  }

  await fs.emptyDir(target);
  return true;
}
