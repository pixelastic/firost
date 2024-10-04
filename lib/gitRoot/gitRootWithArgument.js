import path from 'path';
import findUp from 'find-up';
import absolute from '../absolute.js';
import firostError from '../error.js';

/**
 * Returns the absolute path to the closest .git root of the specified dir
 * @param {string} referenceDir Reference point to check from
 * @returns {string} Absolute filepath of the project root
 **/
export default function (referenceDir) {
  if (!referenceDir) {
    throw new firostError(
      'ERROR_GIT_ROOT_MISSING_ARGUMENT',
      'You call gitRootWithArgument, but did not pass an actual argument',
    );
  }

  const gitFolder = findUp.sync('.git', {
    type: 'directory',
    cwd: absolute(referenceDir),
  });
  return path.dirname(gitFolder);
}
