import path from 'node:path';
import { up as packageUp } from 'empathic/package';
import { absolute } from '../absolute.js';
import { firostError } from '../firostError.js';

/**
 * Returns the absolute path to the closest package root of the specified dir
 * @param {string} referenceDir Reference point to check from
 * @returns {string} Absolute filepath of the project root
 **/
export function packageRootWithArgument(referenceDir) {
  if (!referenceDir) {
    throw new firostError(
      'ERROR_PACKAGE_ROOT_MISSING_ARGUMENT',
      'You called packageRootWithArgument, but did not pass an actual argument',
    );
  }

  const packagePath = packageUp({
    cwd: absolute(referenceDir),
  });

  if (!packagePath) {
    return null;
  }

  return path.dirname(packagePath);
}
