import fs from 'fs-extra';
import isGlob from 'is-glob';
import { pMap } from 'golgoth';
import { glob } from './glob.js';
import { absolute } from './absolute.js';

/**
 * Delete file
 * @param {string} targetOrGlob Path(s) to the file(s) to delete
 **/
export async function remove(targetOrGlob) {
  let targets = isGlob(targetOrGlob)
    ? await glob(targetOrGlob)
    : [targetOrGlob];

  // Deleting each matching element
  await pMap(targets, async (target) => {
    const absoluteTarget = absolute(target);
    await fs.remove(absoluteTarget);
  });
}
