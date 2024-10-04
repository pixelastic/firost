import path from 'path';
import fs from 'fs-extra';
import { _ } from 'golgoth';
import mkdirp from './mkdirp.js';
import absolute from './absolute.js';

/**
 * Write some content to disk
 * Note: It will create the directories if needed
 * @param {string} what Content to write to the file
 * @param {string} userWhere Destination filepath
 **/
export default async function write(what, userWhere) {
  // Do nothing if there is no content to write
  if (!_.isString(what)) {
    return;
  }
  const where = absolute(userWhere);
  await mkdirp(path.dirname(where));
  await fs.writeFile(where, what);
}
