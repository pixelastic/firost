import path from 'node:path';
import { _ } from 'golgoth';
import fs from 'fs-extra';
import { absolute } from './absolute.js';
import { callerDir } from './callerDir.js';
import { mkdirp } from './mkdirp.js';

/**
 * Write some content to disk
 * Note: It will create the directories if needed
 * @param {string} what Content to write to the file
 * @param {string} userWhere Destination filepath
 **/
export async function write(what, userWhere) {
  // Do nothing if there is no content to write
  if (!_.isString(what)) {
    return;
  }
  const where = absolute(userWhere, { cwd: callerDir() });
  await mkdirp(path.dirname(where));

  try {
    await fs.writeFile(where, what);
  } catch (error) {
    // If we get ENAMETOOLONG, it's likely the arguments are swapped
    if (error.code === 'ENAMETOOLONG') {
      error.code = 'ERROR_SWAPPED_ARGUMENTS';
      error.message = `File path too long. Did you swap the arguments? The correct order is: write(content, filepath)\nOriginal error: ${error.message}`;
    }
    throw error;
  }
}
