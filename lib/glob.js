import path from 'node:path';
import { globby } from 'globby';
import { _ } from 'golgoth';
import { absolute } from './absolute.js';
import { userlandCaller } from './userlandCaller.js';

/**
 * Find files by globbing. Returns files in lexicographical order
 * @param {string} userPatterns Glob pattern(s) to match
 * @param {object} userOptions Options to configure the matching:
 * - directories {boolean} (default: true) Includes directories in the results
 * - hiddenFiles {boolean} (default: true) Includes hidden files in the results
 * - absolutePaths {boolean} (default: true) Returns absolute paths
 * - cwd {string} (default: dirname calling glob()) The root directory of the globs
 * @returns {Array} Array of files matching
 **/
export async function glob(userPatterns, userOptions = {}) {
  const options = {
    directories: true,
    hiddenFiles: true,
    absolutePaths: true,
    cwd: null,
    ...userOptions,
  };

  const { directories, hiddenFiles, cwd, ...otherGlobbyOptions } = options;
  const globbyOptions = {
    onlyFiles: !directories,
    dot: hiddenFiles,
    cwd,
    ...otherGlobbyOptions,
  };

  let patterns = _.castArray(userPatterns);
  patterns = patterns.map((pattern) => {
    return normalizePattern(pattern, cwd);
  });

  const matches = await globby(patterns, globbyOptions);

  // Sort results by lexicographic order (ie. foo_2 will be before foo_10)
  const sortedMatches = matches.sort((a, b) =>
    a.localeCompare(b, 'en', { numeric: true }),
  );

  // If absolutePaths is false, we need to trim the cwd from the results
  if (!options.absolutePaths) {
    const replaceRegexp = new RegExp('^' + _.escapeRegExp(cwd + '/'));
    return _.map(sortedMatches, (match) => {
      return match.replace(replaceRegexp, '');
    });
  }

  return sortedMatches;
}

/**
 * Normalizes a file pattern by resolving relative paths and handling negation patterns.
 * @param {string} pattern - The file pattern to normalize, may include negation prefix '!'
 * @param {string} [userCwd] - Optional current working directory to use for relative paths
 * @returns {string} The normalized absolute pattern with negation prefix preserved if present
 */
function normalizePattern(pattern, userCwd) {
  // If is a negation, we apply only on the rest
  if (_.startsWith(pattern, '!')) {
    return '!' + normalizePattern(pattern.slice(1), userCwd);
  }

  // If relative, we prepend the cwd
  const isAbsolute = pattern[0] == '/';
  const isPlaceholder = pattern[0] == '<';
  const isRelative = !isAbsolute && !isPlaceholder;
  if (isRelative) {
    // As the file is relative, we try to get the userlandCaller
    const cwd = userCwd || path.dirname(userlandCaller());
    return normalizePattern(`${cwd}/${pattern}`);
  }

  return absolute(pattern);
}
