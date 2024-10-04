import path from 'path';
import findUp from 'find-up';
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
      'You call packageRootWithArgument, but did not pass an actual argument',
    );
  }

  const packagePath = findUp.sync('package.json', {
    cwd: absolute(referenceDir),
  });
  return path.dirname(packagePath);
}
