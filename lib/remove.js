import fs from 'fs-extra';
import isGlob from 'is-glob';
import glob from './glob.js';
import { pMap } from 'golgoth';
import absolute from './absolute.js';

/**
 * Delete file
 * @param {string} targetOrGlob Path(s) to the file(s) to delete
 **/
export default async function remove(targetOrGlob) {
  let targets = isGlob(targetOrGlob)
    ? await glob(targetOrGlob)
    : [targetOrGlob];

  // Deleting each matching element
  await pMap(targets, async (target) => {
    const absoluteTarget = absolute(target);
    await fs.remove(absoluteTarget);
  });
}