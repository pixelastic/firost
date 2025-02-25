import path from 'node:path';
import { up as findUp } from 'empathic/find';
import { firostError } from '../firostError.js';
import { userlandCaller } from '../userlandCaller.js';

/**
 * Returns the absolute path to the closest .git root of the calling script
 * @param {string} argument Should be empty
 * @returns {string} Absolute filepath of the project root
 **/
export function gitRootWithoutArgument(argument) {
  if (argument) {
    throw new firostError(
      'ERROR_GIT_ROOT_SPECIFIED_ARGUMENT',
      'You called gitRootWithoutArgument, but did pass an actual argument',
    );
  }

  const gitFolder = findUp('.git', {
    cwd: path.dirname(userlandCaller()),
  });
  return path.dirname(gitFolder);
}
