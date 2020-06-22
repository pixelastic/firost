const stringify = require('json-stable-stringify');
const write = require('./write');

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
  /* eslint-disable no-empty,import/no-extraneous-dependencies */
  try {
    const prettier = writeJson.__require('prettier');
    content = prettier.format(content, { parser: 'json' });
  } catch (err) {}
  /* eslint-enable no-empty,import/no-extraneous-dependencies */

  // Write to disk
  await write(content, where);
}
writeJson.__require = require;

module.exports = writeJson;
