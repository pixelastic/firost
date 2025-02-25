import stringify from 'json-stable-stringify';
import { write } from './write.js';
import { firostImport } from './firostImport.js';

export const __ = {
  getPrettier,
};

/**
 * Writes an object to JSON on disk
 * @param {object} what Object to convert to json and write to disk
 * @param {string} where Filepath to write the file to
 * @param {object} userOptions Options to change behavior.
 * - sort {Boolean} (default: true) If set to true, keys in the result will be
 *   sorted, so diffing will be made easier and hashing will give consistent
 *   results
 **/
export async function writeJson(what, where, userOptions = {}) {
  const options = {
    sort: true,
    ...userOptions,
  };

  // Do nothing if no content to write
  if (what === undefined) {
    return;
  }

  let content;
  if (options.sort) {
    content = stringify(what, { space: 2 });
  } else {
    content = JSON.stringify(what, null, 2);
  }

  // Try to prettify it if prettier is available
  const prettier = await __.getPrettier();
  if (prettier) {
    content = await prettier.format(content, { parser: 'json' });
  }

  // Write to disk
  await write(content, where);
}

/**
 * Returns Prettier if available
 * @returns {object} Prettier module
 */
async function getPrettier() {
  try {
    return await firostImport('prettier');
  } catch (_err) {
    return null;
  }
}
