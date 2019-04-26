import stringify from 'json-stable-stringify';
import write from './write';
import { _ } from 'golgoth';

/**
 * Writes an object to JSON on disk
 * @param {Object} what Object to convert to json and write to disk
 * @param {String} where Filepath to write the file to
 * @returns {Void}
 **/
const module = async function writeJson(what, where) {
  // The order of arguments changed during development. We try to warn users if
  // they pass a content instead of a filepath
  if (_.includes(where, '\n')) {
    throw new Error(
      '[firost.writeJson]: Arguments are (what, where). It seems you did the opposite'
    );
  }

  const content = stringify(what, { space: 2 });
  await write(content, where);
};
export default module;
