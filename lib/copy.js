import fs from 'fs-extra';
import { pMap } from 'golgoth';
import helper from './copyOrMoveHelper.js';
import remove from './remove.js';

/**
 * Copy files from source to destination
 * @param {string|Array} userSource Path (as a string, glob or array) to the source file(s)
 * @param {string} userDestination Path to the destination file or directory
 * @param {object} options Options to change the behavior:
 * - options.resolveSymlinks (default: false). If set to true, symbolic links
 *   will be replaced with the file they target
 **/
export default async function (userSource, userDestination, options = {}) {
  const list = await helper.getMap(userSource, userDestination, options);

  await pMap(
    list,
    async (item) => {
      const {
        source,
        destination,
        sourceIsSymlink,
        destinationIsSymlink,
        destinationExists,
      } = item;
      // Symlinks are finicky.
      // - Copying a symlink on a symlink can fail because it causes an infinite
      // loop
      // - Copying a symlink over an existing file fails
      // So we need to remove the destination before copying in those cases
      if (sourceIsSymlink && (destinationExists || destinationIsSymlink)) {
        await remove(destination);
      }

      await fs.copy(source, destination);
    },
    { concurrency: 100 },
  );
}
