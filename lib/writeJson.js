import stringify from 'json-stable-stringify';
import write from './write';
import { _ } from 'golgoth';

/**
 * Writes an object to JSON on disk
 * @param {object} what Object to convert to json and write to disk
 * @param {string} where Filepath to write the file to
 * @param {object} userOptions Options to change behavior.
 * - sort {Boolean} (default: true) If set to true, keys in the result will be
 *   sorted, so diffing will be made easier and hashing will give consistent
 *   results
 **/
const module = async function writeJson(what, where, userOptions = {}) {
  // The order of arguments changed during development. We try to warn users if
  // they pass a content instead of a filepath
  if (_.includes(where, '\n')) {
    throw new Error(
      '[firost.writeJson]: Arguments are (what, where). It seems you did the opposite'
    );
  }

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

  await write(content, where);
};
export default module;
