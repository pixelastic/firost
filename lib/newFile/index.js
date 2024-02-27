import path from 'path';
import mkdirp from './../mkdirp.js';
import write from './../write.js';
import dirname from './../dirname.js';
import exists from './../exists.js';
import copy from './../copy.js';
import { _ } from 'golgoth';

/**
 * Create the smallest possible syntactically valid file at the specified
 * location
 * @param {string} filepath Path to create the file
 */
export default async function newFile(filepath) {
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
