import path from 'node:path';
import { up as packageUp } from 'empathic/package';
import { firostError } from '../firostError.js';
import { userlandCaller } from '../userlandCaller.js';

/**
 * Returns the absolute path to the closest package root of the calling script
 * @param {string} argument Should be empty
 * @returns {string} Absolute filepath of the project root
 **/
export function packageRootWithoutArgument(argument) {
  if (argument) {
    throw new firostError(
      'ERROR_PACKAGE_ROOT_SPECIFIED_ARGUMENT',
      'You called packageRootWithoutArgument, but did pass an actual argument',
    );
  }

  const packagePath = packageUp({
    cwd: userlandCaller(),
  });

  return path.dirname(packagePath);
}
