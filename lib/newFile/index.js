import path from 'node:path';
import { _ } from 'golgoth';
import { absolute } from '../absolute.js';
import { callerDir } from '../callerDir.js';
import { copy } from '../copy.js';
import { dirname } from '../dirname.js';
import { exists } from '../exists.js';
import { mkdirp } from '../mkdirp.js';
import { write } from '../write.js';

/**
 * Create the smallest possible syntactically valid file at the specified
 * location
 * @param {string} userFilepath Path to create the file
 */
export async function newFile(userFilepath) {
  const isDirectory = _.endsWith(userFilepath, '/');
  const filepath = absolute(userFilepath, { cwd: callerDir() });

  // Create directory if ends with /
  if (isDirectory) {
    await mkdirp(filepath);
    return;
  }

  // If no extension, create empty file
  const extension = _.trim(path.extname(filepath), '.');
  if (!extension) {
    await write('', filepath);
    return;
  }

  // Check if we have a template for this extension
  const templatePath = path.resolve(
    dirname(),
    'templates',
    `${extension}.${extension}`,
  );
  if (await exists(templatePath)) {
    await copy(templatePath, filepath);
    return;
  }

  await write('', filepath);
  return;
}
