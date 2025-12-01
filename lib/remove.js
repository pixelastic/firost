import fs from 'fs-extra';
import isGlob from 'is-glob';
import { _, pMap } from 'golgoth';
import { glob } from './glob.js';
import { absolute } from './absolute.js';

/**
 * Delete file
 * @param {string|Array} targetOrGlob Path(s) to the file(s) to delete
 **/
export async function remove(targetOrGlob) {
  // Convert to array
  let targets = _.castArray(targetOrGlob);

  // Expand globs
  targets = await pMap(targets, async (target) => {
    return isGlob(target) ? await glob(target) : target;
  });

  // Flatten into one level
  targets = _.flatten(targets);

  // Expand to absolute paths
  // Note: _.map() won't work, so we stick with .map()
  targets = targets.map((target) => absolute(target));

  // Deleting each matching element
  await pMap(targets, async (target) => {
    await fs.remove(target);
  });
}
