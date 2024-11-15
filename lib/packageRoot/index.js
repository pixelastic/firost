import packageRootWithArgument from './packageRootWithArgument.js';
import packageRootWithoutArgument from './packageRootWithoutArgument.js';

/**
 * Returns the absolute path to the current package root, where the closest
 * package.json is
 * @param {string} referenceDir Reference point to check from. Default to file
 * calling the method
 * @returns {string} Absolute filepath of the project root
 **/
export default function packageRoot(referenceDir) {
  return referenceDir
    ? packageRootWithArgument(referenceDir)
    : packageRootWithoutArgument();
}
