import { pMap } from 'golgoth';
import fs from 'fs-extra';
import { callerDir } from './callerDir.js';
import { firostError } from './firostError.js';
import { getMap } from './helpers/copyOrMove.js';

/**
 * Copy files from source to destination
 * @param {string|Array} userSource Path (as a string, glob or array) to the source file(s)
 * @param {string} userDestination Path to the destination file or directory
 **/
export async function move(userSource, userDestination) {
  let list;
  try {
    list = await getMap(userSource, userDestination, { cwd: callerDir() });
  } catch (err) {
    const newCode = err.code.replace('COPY_OR_MOVE', 'MOVE');
    throw firostError(newCode, err.message);
  }

  await pMap(
    list,
    async (item) => {
      await fs.move(item.source, item.destination, { overwrite: true });
    },
    { concurrency: 100 },
  );
}
