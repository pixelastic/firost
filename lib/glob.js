import path from 'node:path';
import { globby } from 'globby';
import { _ } from 'golgoth';
import { firostError } from './firostError.js';
import { absolute } from './absolute.js';
import { commonParentDirectory } from './commonParentDirectory.js';

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
  const manifest = getPatternManifest(userPatterns);
  ensureValidInputs(options, manifest);

  const { patterns, cwd } = normalizePatterns(manifest, options.cwd);

  // Note that globby has its own options,
  // but also accepts any of fast-glob options
  // https://github.com/sindresorhus/globby#options
  // https://github.com/mrmlnc/fast-glob#options-3
  const globbyOptions = {
    onlyFiles: !options.directories, // from fast-glob
    dot: options.hiddenFiles, // from fast-glob
    absolute: options.absolutePaths, // from fast-glob
    markDirectories: true, // from fast-glob
    caseSensitiveMatch: false, // from fast-glob
    cwd,
  };

  const matches = await globby(patterns, globbyOptions);

  return sortFilepaths(matches);
}

/**
 * Builds a manifest of pattern information, as an array of objects
 * @param {string|string[]} userPatterns - Pattern or array of patterns to process
 * @returns {Array<object>} Array of pattern objects containing pattern data
 */
function getPatternManifest(userPatterns) {
  // Here, we build an array of objects representing the various patterns.
  // We save things like if it's a negation (starts with !), if it contains a
  // placeholder (starts with <), or if it's a relative or absolute path.
  // We also save the original pattern, as well as its noNegation variant
  //
  // We do no convert placeholders or relative filepaths yet here
  return _.chain(userPatterns)
    .castArray()
    .map((originalPattern) => {
      const isNegation = _.startsWith(originalPattern, '!');
      const noNegationPattern = isNegation
        ? originalPattern.slice(1)
        : originalPattern;

      const hasPlaceholder = _.startsWith(noNegationPattern, '<');
      const isAbsolute = _.startsWith(noNegationPattern, '/');
      const isRelative = !isAbsolute && !hasPlaceholder;

      return {
        originalPattern,
        noNegationPattern,
        isNegation,
        hasPlaceholder,
        isRelative,
      };
    })
    .value();
}

/**
 * Validates glob options and manifest inputs, throwing errors if impossible
 * combination is selected
 * @param {object} options - Configuration options for glob operation
 * @param {Array} manifest - Array of glob pattern objects to validate
 * @returns {void}
 */
function ensureValidInputs(options, manifest) {
  // We need to be more strict on the inputs and outputs only if cwd is missing
  if (options.cwd) {
    return;
  }

  // Can't output relative paths if no cwd provided
  if (!options.absolutePaths) {
    throw new firostError(
      'FIROST_GLOB_RELATIVE_OUTPUT_MISSING_CWD',
      'You used glob() with relative patterns, but did not provide a .cwd',
    );
  }

  // Can't use relative patterns if no cwd provided
  const hasRelativePatterns = _.some(manifest, (item) => {
    return item.isRelative;
  });
  if (hasRelativePatterns) {
    throw new firostError(
      'FIROST_GLOB_RELATIVE_PATTERN_MISSING_CWD',
      'You used glob() with relative patterns, but did not provide a .cwd',
    );
  }
}

/**
 * Given a manifest and a cwd, will find the common cwd parent and update the
 * patterns to be relative to it
 * @param {Array<object>} manifest - Array of pattern objects
 * @param {string} userCwd - Reference cwd
 * @returns {object} Object containing the normalized cwd and patterns array
 */
function normalizePatterns(manifest, userCwd) {
  // First, we cast all noNegation filepaths to absolute paths
  _.each(manifest, (item) => {
    const { isRelative, hasPlaceholder, noNegationPattern } = item;
    let absoluteNoNegationPattern = noNegationPattern;
    if (isRelative) {
      absoluteNoNegationPattern = `${userCwd}/${noNegationPattern}`;
    }
    if (hasPlaceholder) {
      absoluteNoNegationPattern = absolute(noNegationPattern);
    }

    item.absoluteNoNegationPattern = absoluteNoNegationPattern;
  });

  // Then, we find the common parent directory between all patterns and the
  // provided cwd
  const normalizedCwd = commonParentDirectory([
    ..._.map(manifest, 'absoluteNoNegationPattern'),
    userCwd,
  ]);

  // Finally, we normalize all patterns to be relative to the normalized cwd we
  // found above
  const normalizedPatterns = _.map(manifest, (item) => {
    const { absoluteNoNegationPattern, isNegation } = item;
    let pattern = _.replace(absoluteNoNegationPattern, `${normalizedCwd}/`, '');
    return isNegation ? `!${pattern}` : pattern;
  });

  return {
    cwd: normalizedCwd,
    patterns: normalizedPatterns,
  };
}

/**
 * Sort filepaths similary to how "ls -la" works.
 * First the directories (with the hidden ones first), then the files (hidden
 * files first).
 * Files are groupes by parent, and ordered in lexicographical order (picture_18
 * is before picture_100)
 * @param {string[]} filepaths - Array of file paths to sort
 * @returns {string[]} Sorted array of file paths
 */
function sortFilepaths(filepaths) {
  /**
   * Calculates priority value based on folder and visibility status
   * 1=hidden folder
   * 2=regular folder
   * 3=hidden file
   * 4=regular file
   * @param {boolean} isFolder - Whether the item is a folder
   * @param {boolean} isHidden - Whether the item is hidden
   * @returns {number} Priority value from 1-4, where 1 is highest priority
   */
  function getPriority(isFolder, isHidden) {
    if (isFolder && isHidden) return 1;
    if (isFolder && !isHidden) return 2;
    if (!isFolder && isHidden) return 3;
    return 4;
  }

  /**
   * Sorts two strings lexicographically (so picture_18.png is before picture_100.png)
   * @param {string} a - First string to compare
   * @param {string} b - Second string to compare
   * @returns {number} Negative if a < b, positive if a > b, zero if equal
   */
  function lexicographicalSort(a, b) {
    return a.localeCompare(b, 'en', { numeric: true });
  }
  const sortedFilepaths = filepaths.sort((a, b) => {
    const aDir = path.dirname(a);
    const bDir = path.dirname(b);

    // First, group by parent directory
    const dirCompare = lexicographicalSort(aDir, bDir);
    if (dirCompare !== 0) return dirCompare;

    const aBase = path.basename(a);
    const bBase = path.basename(b);

    // Within the same directory, categorize each item
    const aIsFolder = _.endsWith(a, '/');
    const bIsFolder = _.endsWith(b, '/');
    const aIsHidden = _.startsWith(aBase, '.');
    const bIsHidden = _.startsWith(bBase, '.');

    const aPriority = getPriority(aIsFolder, aIsHidden);
    const bPriority = getPriority(bIsFolder, bIsHidden);

    if (aPriority !== bPriority) return aPriority - bPriority;

    // Same priority, sort lexicographically with natural sorting
    return lexicographicalSort(aBase, bBase);
  });

  // Remove trailing slash of directories for consistency
  return _.map(sortedFilepaths, (filepath) => {
    return _.trimEnd(filepath, '/');
  });
}
