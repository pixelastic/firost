import path from 'path';
import { findUpSync } from 'find-up';
import absolute from '../absolute.js';
import firostError from '../error.js';

/**
 * Returns the absolute path to the closest package root of the specified dir
 * @param {string} referenceDir Reference point to check from
 * @returns {string} Absolute filepath of the project root
 **/
export default function (referenceDir) {
  if (!referenceDir) {
    throw new firostError(
      'ERROR_PACKAGE_ROOT_MISSING_ARGUMENT',
      'You called packageRootWithArgument, but did not pass an actual argument',
    );
  }

  const packagePath = findUpSync('package.json', {
    cwd: absolute(referenceDir),
  });
  return path.dirname(packagePath);
}
