import path from 'path';
import findUp from 'find-up';
import callsites from 'callsites';
import firostError from '../error.js';

/**
 * Returns the absolute path to the closest package root of the calling script
 * @param {string} argument Should be empty
 * @returns {string} Absolute filepath of the project root
 **/
export default function (argument) {
  if (argument) {
    throw new firostError(
      'ERROR_PACKAGE_ROOT_SPECIFIED_ARGUMENT',
      'You call packageRootWithoutArgument, but did pass an actual argument',
    );
  }

  const packagePath = findUp.sync('package.json', {
    cwd: path.dirname(callsites()[1].getFileName()),
  });
  return path.dirname(packagePath);
}
