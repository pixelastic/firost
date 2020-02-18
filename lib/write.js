import fs from 'fs-extra';
import path from 'path';
import mkdirp from './mkdirp';
import _ from 'golgoth/lib/_';

/**
 * Write some content to disk
 * Note: It will create the directories if needed
 * @param {string} what Content to write to the file
 * @param {string} where Destination filepath
 **/
const module = async function write(what, where) {
  // The order of arguments changed during development. We try to warn users if
  // they pass a content instead of a filepath
  if (_.includes(where, '\n')) {
    throw new Error(
      '[firost.write]: Arguments are (what, where). It seems you did the opposite'
    );
  }

  await mkdirp(path.dirname(where));
  await fs.writeFile(where, what);
};

export default module;
