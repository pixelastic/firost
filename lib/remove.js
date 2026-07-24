import { _, pMap } from 'golgoth';
import fs from 'fs-extra';
import isGlob from 'is-glob';
import { absolute } from './absolute.js';
import { callerDirectory } from './callerDirectory.js';
import { glob } from './glob.js';

/**
 * Delete file
 * @param {string|Array} targetOrGlob Path(s) to the file(s) to delete
 **/
export async function remove(targetOrGlob) {
  // Convert to array
  let targets = _.castArray(targetOrGlob);

  // Expand to absolute paths
  const cwd = callerDirectory();
  targets = targets.map((target) => {
    return absolute(target, { cwd });
  });

  // Expand globs
  targets = await pMap(targets, async (target) => {
    return isGlob(target) ? await glob(target) : target;
  });

  // Flatten into one level
  targets = _.flatten(targets);

  // Deleting each matching element
  await pMap(targets, async (target) => {
    await fs.remove(target);
  });
}
