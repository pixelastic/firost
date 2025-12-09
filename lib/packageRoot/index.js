import path from 'node:path';
import { up as packageUp } from 'empathic/package';
import { userlandCaller } from '../userlandCaller.js';

/**
 * Returns the absolute path to the current package root, where the closest
 * package.json is
 * @param {string} userReference Reference point to check from. Default to file
 * calling the method
 * @returns {string} Absolute filepath of the project root
 **/
export function packageRoot(userReference) {
  // Use passed reference, or default to userland caller
  let reference;
  if (userReference) {
    reference = path.resolve(userReference);
  } else {
    reference = userlandCaller();
  }

  const packagePath = packageUp({ cwd: reference });
  // Stop if we won't find anything
  if (!packagePath) {
    return null;
  }

  // Return only the dirname
  return path.dirname(packagePath);
}
