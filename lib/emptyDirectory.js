import { _ } from 'golgoth';
import fs from 'fs-extra';
import { absolute } from './absolute.js';
import { callerDirectory } from './callerDirectory.js';
import { firostError } from './firostError.js';
import { isDirectory } from './isDirectory.js';

/**
 * Remove content of a directory
 * @param {string} userTarget Directory to empty
 * @returns {boolean} True on success, false on error
 **/
export async function emptyDirectory(userTarget) {
  // Throw if not a string.
  // This has happened to me several times that I try to pass the tmpDirectory
  // function rather than a string of the path
  if (!_.isString(userTarget)) {
    throw firostError(
      'FIROST_EMPTY_DIRECTORY_TARGET_MUST_BE_STRING',
      `The target provided to emptyDirectory() is not a string: ${userTarget}`,
    );
  }

  const target = absolute(userTarget, { cwd: callerDirectory() });
  if (!(await isDirectory(target))) {
    return false;
  }

  // eslint-disable-next-line aberlaas/no-abbreviated-names
  await fs.emptyDir(target);
  return true;
}
