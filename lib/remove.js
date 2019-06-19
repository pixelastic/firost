import fs from 'fs-extra';
import isGlob from 'is-glob';
import glob from './glob';
import { pMap } from 'golgoth';

/**
 * Delete file
 * @param {string} targetOrGlob Path(s) to the file(s) to delete
 * @returns {void}
 **/
const module = async function remove(targetOrGlob) {
  if (!isGlob(targetOrGlob)) {
    await fs.remove(targetOrGlob);
    return;
  }

  // Deleting each matching element
  const targets = await glob(targetOrGlob);
  await pMap(targets, async target => {
    await fs.remove(target);
  });
};

export default module;
