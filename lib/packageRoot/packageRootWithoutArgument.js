import path from 'path';
import { findUpSync } from 'find-up';
import firostError from '../error.js';
import userlandCaller from '../userlandCaller.js';

/**
 * Returns the absolute path to the closest package root of the calling script
 * @param {string} argument Should be empty
 * @returns {string} Absolute filepath of the project root
 **/
export default function (argument) {
  if (argument) {
    throw new firostError(
      'ERROR_PACKAGE_ROOT_SPECIFIED_ARGUMENT',
      'You called packageRootWithoutArgument, but did pass an actual argument',
    );
  }

  const packagePath = findUpSync('package.json', {
    cwd: userlandCaller(),
  });
  return path.dirname(packagePath);
}
