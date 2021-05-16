const fs = require('fs-extra');
const pMap = require('golgoth/pMap');
const helper = require('./copyOrMoveHelper.js');
const isSymlink = require('./isSymlink.js');
const remove = require('./remove.js');

/**
 * Copy files from source to destination
 * @param {string|Array} userSource Path (as a string, glob or array) to the source file(s)
 * @param {string} userDestination Path to the destination file or directory
 * @param {object} options Options to change the behavior:
 * - options.resolveSymlinks (default: false). If set to true, symbolic links
 *   will be replaced with the file they target
 **/
module.exports = async function (userSource, userDestination, options = {}) {
  const list = await helper.getMap(userSource, userDestination, options);

  await pMap(
    list,
    async (item) => {
      // We need to first delete the destination if it's a symlink, because
      // copying over a symlink can result in looping links and an error
      if (await isSymlink(item.destination)) {
        await remove(item.destination);
      }
      await fs.copy(item.source, item.destination);
    },
    { concurrency: 1 }
  );
};
