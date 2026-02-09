import { _ } from 'golgoth';
import fs from 'fs-extra';
import { absolute } from './absolute.js';
import { callerDir } from './callerDir.js';
import { firostError } from './firostError.js';
import { isDirectory } from './isDirectory.js';

/**
 * Remove content of a directory
 * @param {string} userTarget Directory to empty
 * @returns {boolean} True on success, false on error
 **/
export async function emptyDir(userTarget) {
  // Throw if not a string.
  // This has happened to me several times that I try to pass the tmpDirectory
  // function rather than a string of the path
  if (!_.isString(userTarget)) {
    throw firostError(
      'FIROST_EMPTY_DIR_TARGET_MUST_BE_STRING',
      `The target provided to emptyDir() is not a string: ${userTarget}`,
    );
  }

  const target = absolute(userTarget, { cwd: callerDir() });
  if (!(await isDirectory(target))) {
    return false;
  }

  await fs.emptyDir(target);
  return true;
}
