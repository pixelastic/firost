import path from 'node:path';
import { up as findUp } from 'empathic/find';
import { userlandCaller } from './userlandCaller.js';

/**
 * Returns the absolute path to the current git root, where the closest .git
 * folder is
 * @param {string} userReference Reference point to check from. Default to file
 * calling the method
 * @returns {string} Absolute filepath of the git root
 **/
export function gitRoot(userReference) {
  // Use passed reference, or default to userland caller
  let reference;
  if (userReference) {
    reference = path.resolve(userReference);
  } else {
    reference = userlandCaller();
  }

  const gitFolder = findUp('.git', { cwd: reference });

  // Stop if we won't find anything
  if (!gitFolder) {
    return null;
  }

  // Return only the dirname
  return path.dirname(gitFolder);
}
