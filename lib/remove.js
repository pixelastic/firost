const fs = require('fs-extra');
const isGlob = require('is-glob');
const glob = require('./glob');
const pMap = require('golgoth/lib/pMap');

/**
 * Delete file
 * @param {string} targetOrGlob Path(s) to the file(s) to delete
 **/
module.exports = async function remove(targetOrGlob) {
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
