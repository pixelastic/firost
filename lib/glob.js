import path from 'path';
import { globby } from 'globby';
import { _ } from 'golgoth';
import consoleInfo from './consoleInfo.js';

/**
 * Find files by globbing. Returns files in lexicographical order
 * @param {string} pattern Glob pattern to match
 * @param {object} userOptions Options to configure the matching:
 * - directories {boolean} (default: true) Includes directories in the results
 * - hiddenFiles {boolean} (default: true) Includes hidden files in the results
 * - absolutePaths {boolean} (default: true) Returns absolute paths
 * - cwd {string} (default: current directory) The root directory of the globs
 * @returns {Array} Array of files matching
 **/
export default async function glob(pattern, userOptions = {}) {
  const options = {
    directories: true,
    hiddenFiles: true,
    absolutePaths: true,
    cwd: process.cwd(),
    ...userOptions,
  };

  // We used to have named the option .context, but .cwd is actually a better
  // name as it's the same as what is used in run() and internally by globby.
  if (options.context) {
    consoleInfo(
      'The .context option of firost glob() function has been renamed to .cwd',
    );
    options.cwd = options.context;
  }

  const { directories, hiddenFiles, cwd, ...otherGlobbyOptions } = options;
  const globbyOptions = {
    onlyFiles: !directories,
    dot: hiddenFiles,
    cwd,
    ...otherGlobbyOptions,
  };
  const matches = await globby(pattern, globbyOptions);

  // Sort results by lexicographic order (ie. foo_2 will be before foo_10)
  const sortedMatches = matches.sort((a, b) =>
    a.localeCompare(b, 'en', { numeric: true }),
  );

  if (options.absolutePaths) {
    return _.map(sortedMatches, (match) => {
      return path.resolve(cwd, match);
    });
  }

  return sortedMatches;
}
