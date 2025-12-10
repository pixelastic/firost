import path from 'node:path';
import { _ } from 'golgoth';
import { mkdirp } from '../mkdirp.js';
import { write } from '../write.js';
import { dirname } from '../dirname.js';
import { exists } from '../exists.js';
import { absolute } from '../absolute.js';
import { copy } from '../copy.js';

/**
 * Create the smallest possible syntactically valid file at the specified
 * location
 * @param {string} userFilepath Path to create the file
 */
export async function newFile(userFilepath) {
  // Note: Callstack is lost when inside a promise callback (or after an await),
  // so we need to expand the filepath here, rather than assume write() or
  // copy() will do it, as they might lose the callstack, and thus be unable to
  // find the userlandCaller
  const filepath = absolute(userFilepath);

  const extension = _.trim(path.extname(filepath), '.');

  // Only create a folder if no extension is given
  if (!extension) {
    await mkdirp(filepath);
    return;
  }

  // Check if we have a template for this extension
  const templatePath = path.resolve(
    dirname(),
    'templates',
    `${extension}.${extension}`,
  );
  if (!(await exists(templatePath))) {
    await write('', filepath);
    return;
  }

  await copy(templatePath, filepath);
}
