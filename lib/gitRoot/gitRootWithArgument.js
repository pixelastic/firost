import path from 'node:path';
import { up as findUp } from 'empathic/find';
import { absolute } from '../absolute.js';
import { firostError } from '../firostError.js';

/**
 * Returns the absolute path to the closest .git root of the specified dir
 * @param {string} referenceDir Reference point to check from
 * @returns {string} Absolute filepath of the project root
 **/
export function gitRootWithArgument(referenceDir) {
  if (!referenceDir) {
    throw new firostError(
      'ERROR_GIT_ROOT_MISSING_ARGUMENT',
      'You called gitRootWithArgument, but did not pass an actual argument',
    );
  }

  const gitFolder = findUp('.git', {
    cwd: absolute(referenceDir),
  });
  return path.dirname(gitFolder);
}
