import fs from 'fs-extra';
import { pMap } from 'golgoth';
import helper from './copyOrMoveHelper.js';

/**
 * Copy files from source to destination
 * @param {string|Array} userSource Path (as a string, glob or array) to the source file(s)
 * @param {string} userDestination Path to the destination file or directory
 **/
export default async function (userSource, userDestination) {
  const list = await helper.getMap(userSource, userDestination);

  await pMap(
    list,
    async (item) => {
      await fs.move(item.source, item.destination, { overwrite: true });
    },
    { concurrency: 100 },
  );
}