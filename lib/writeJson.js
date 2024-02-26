import stringify from 'json-stable-stringify';
import write from './write.js';

/**
 * Writes an object to JSON on disk
 * @param {object} what Object to convert to json and write to disk
 * @param {string} where Filepath to write the file to
 * @param {object} userOptions Options to change behavior.
 * - sort {Boolean} (default: true) If set to true, keys in the result will be
 *   sorted, so diffing will be made easier and hashing will give consistent
 *   results
 **/
async function writeJson(what, where, userOptions = {}) {
  const options = {
    sort: true,
    ...userOptions,
  };

  let content;
  if (options.sort) {
    content = stringify(what, { space: 2 });
  } else {
    content = JSON.stringify(what, null, 2);
  }

  // Try to prettify it if prettier is available
  try {
    const prettier = writeJson.__require('prettier');
    content = await prettier.format(content, { parser: 'json' });
  } catch (err) {
    // We swallow the error because we just want to see if prettier works
  }

  // Write to disk
  await write(content, where);
}
writeJson.__require = require;

export default writeJson;