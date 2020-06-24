const fs = require('fs-extra');
const isGlob = require('is-glob');
const glob = require('./glob');
const pMap = require('golgoth/lib/pMap');
const absolute = require('./absolute');

/**
 * Delete file
 * @param {string} targetOrGlob Path(s) to the file(s) to delete
 **/
module.exports = async function remove(targetOrGlob) {
  let targets = isGlob(targetOrGlob)
    ? await glob(targetOrGlob)
    : [targetOrGlob];

  // Deleting each matching element
  await pMap(targets, async (target) => {
    const absoluteTarget = absolute(target);
    await fs.remove(absoluteTarget);
  });
};
