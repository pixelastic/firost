import path from 'node:path';
import { globby } from 'globby';
import { _ } from 'golgoth';
import { firostError } from './firostError.js';
import { absolute } from './absolute.js';
import { commonParentDirectory } from './commonParentDirectory.js';
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
    ...userOptions,
  };

  const userCwd = options.cwd || path.dirname(userlandCaller());
  const { patterns, cwd } = normalizePatterns(userPatterns, userCwd);

  // globby has its own options, in addition to the ones added by fast-glob
  // https://github.com/sindresorhus/globby#options
  // https://github.com/mrmlnc/fast-glob#options-3
  const {
    // We "extract" from options all the known custom options, to only keep the
    // options to pass to globby/fast-glob by the user
    directories: _directories,
    absolutePaths: _absolutePaths,
    hiddenFiles: _hiddenFiles,
    cwd: _cwd,
    ...otherGlobbyOptions
  } = options;

  const globbyOptions = {
    onlyFiles: !options.directories, // from fast-glob
    absolute: options.absolutePaths, // from fast-glob
    dot: options.hiddenFiles, // from fast-glob
    cwd,
    ...otherGlobbyOptions,
  };

  // If user asked for relative filepaths, but we changed the cwd internally
  // because they also asked for relative and absolute patterns, we need to
  // throw an error
  if (!options.absolutePaths && cwd != userCwd) {
    throw new firostError(
      'FIROST_GLOB_RELATIVE_OUTPUT_WITH_ABSOLUTE_AND_RELATIVE_INPUTS',
      'You used glob() with absolutePaths: false, but provided both absolute and relative patterns, which is not possible.',
    );
  }

  const matches = await globby(patterns, globbyOptions);

  // Sort results by lexicographic order (ie. foo_2 will be before foo_10)
  const sortedMatches = matches.sort((a, b) =>
    a.localeCompare(b, 'en', { numeric: true }),
  );

  return sortedMatches;
}

/**
 * Given a cwd and a set of patterns, will update both to ensure all patterns
 * are relative to the cwd.
 *
 * @param {string|string[]} userPatterns - File patterns to normalize, can be a
 * single pattern or array of patterns
 * @param {string} userCwd - Current working directory to use as base for
 * relative patterns
 * @returns {{cwd: string, patterns: string[]}} Object containing the normalized
 * common working directory and array of normalized patterns
 */
function normalizePatterns(userPatterns, userCwd) {
  // First, build a manifest of all patterns, including their original value, if
  // their are negated, and their absolute path
  // Note: We can't use _.map here, as it will prevent absolute() from getting
  // the right userlandCaller.
  const manifest = _.castArray(userPatterns).map((originalPattern) => {
    const isNegation = _.startsWith(originalPattern, '!');
    const pattern = isNegation ? originalPattern.slice(1) : originalPattern;

    const isPlaceholder = _.startsWith(pattern, '<');
    const isAbsolute = _.startsWith(pattern, '/');
    const isRelative = !isAbsolute && !isPlaceholder;

    const absolutePattern = isRelative
      ? absolute(`${userCwd}/${pattern}`)
      : absolute(pattern);

    return {
      originalPattern,
      pattern,
      absolutePattern,
      isNegation,
      isPlaceholder,
      isRelative,
    };
  });

  // Find the common parent directory between all patterns and the provided cwd
  const normalizedCwd = commonParentDirectory([
    ..._.map(manifest, 'absolutePattern'),
    userCwd,
  ]);

  // Now, normalize all patterns to be relative to the normalized cwd
  const normalizedPatterns = _.map(manifest, (item) => {
    const { isNegation, absolutePattern } = item;
    const relativePattern = _.replace(absolutePattern, `${normalizedCwd}/`, '');
    return isNegation ? `!${relativePattern}` : relativePattern;
  });

  return {
    cwd: normalizedCwd,
    patterns: normalizedPatterns,
  };
}
