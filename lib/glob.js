import globby from 'globby';
import path from 'path';
import { _ } from 'golgoth';

/**
 * Find files by globbing. Returns files in lexicographical order
 * @param {string} pattern Glob pattern to match
 * @param {object} userOptions Options to configure the matching:
 * - directories {boolean} (default: true) Includes directories in the results
 * - hiddenFiles {boolean} (default: true) Includes hidden files in the results
 * - absolutePaths {boolean} (default: true) Returns absolute paths
 * - context {string} (default: current directory) The root directory of the globs
 * @returns {Array} Array of files matching
 **/
export default async function glob(pattern, userOptions = {}) {
  const options = {
    directories: true,
    hiddenFiles: true,
    absolutePaths: true,
    context: process.cwd(),
    ...userOptions,
  };

  const { directories, hiddenFiles, context, ...otherGlobbyOptions } = options;
  const globbyOptions = {
    onlyFiles: !directories,
    dot: hiddenFiles,
    cwd: context,
    ...otherGlobbyOptions,
  };
  const matches = await globby(pattern, globbyOptions);

  // Sort results by lexicographic order (ie. foo_2 will be before foo_10)
  const sortedMatches = matches.sort((a, b) =>
    a.localeCompare(b, 'en', { numeric: true }),
  );

  if (options.absolutePaths) {
    return _.map(sortedMatches, (match) => {
      return path.resolve(context, match);
    });
  }

  return sortedMatches;
}