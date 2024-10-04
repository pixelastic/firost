import gitRootWithArgument from './gitRootWithArgument.js';
import gitRootWithoutArgument from './gitRootWithoutArgument.js';

/**
 * Returns the absolute path to the current git root, where the closest .git
 * folder is
 * @param {string} referenceDir Reference point to check from. Default to file
 * calling the method
 * @returns {string} Absolute filepath of the project root
 *
 * Note: We had to break this function into two smaller functions to avoid
 * cyclic dependencies with gitRoot as:
 * - gitRoot(something) calls absolute() on something to normalize it
 * - absolute('<gitRoot>/somewhere) calls gitRoot to replace the placeholder
 *
 * By splitting, we make sure gitRootWithoutArgument does not rely on
 * absolute(), thus breaking the cyclic chain.
 **/
export default function (referenceDir) {
  return referenceDir
    ? gitRootWithArgument(referenceDir)
    : gitRootWithoutArgument();
}
