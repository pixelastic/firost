import callsites from 'callsites';
import path from 'path';
import findUp from 'find-up';
import absolute from './absolute.js';

/**
 * Returns the absolute path to the current package root, where the closest
 * package.json is
 * @param {string} referenceDir Reference point to check from. Default to file
 * calling the method
 * @returns {string} Absolute filepath of the project root
 **/
export default function (referenceDir) {
  const callingPath = referenceDir
    ? absolute(referenceDir)
    : path.dirname(callsites()[1].getFileName());

  const packagePath = findUp.sync('package.json', {
    cwd: callingPath,
  });
  return path.dirname(packagePath);
}