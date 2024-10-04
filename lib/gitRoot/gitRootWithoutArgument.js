import path from 'path';
import { findUpSync } from 'find-up';
import callsites from 'callsites';
import firostError from '../error.js';

/**
 * Returns the absolute path to the closest .git root of the calling script
 * @param {string} argument Should be empty
 * @returns {string} Absolute filepath of the project root
 **/
export default function (argument) {
  if (argument) {
    throw new firostError(
      'ERROR_GIT_ROOT_SPECIFIED_ARGUMENT',
      'You called gitRootWithoutArgument, but did pass an actual argument',
    );
  }

  const gitFolder = findUpSync('.git', {
    type: 'directory',
    cwd: callsites()[1].getFileName(),
  });
  return path.dirname(gitFolder);
}