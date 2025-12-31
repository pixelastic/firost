import path from 'node:path';
import isGlob from 'is-glob';
import { _ } from 'golgoth';
/**
 * Finds the common parent directory path shared by all provided file paths
 * @param {string[]} filepaths - Array of file paths to analyze
 * @returns {string} The common parent directory path
 */
export function commonParentDirectory(filepaths) {
  const allPaths = _.chain(filepaths).castArray().compact().sort().value();
  if (_.isEmpty(allPaths)) {
    return false;
  }

  // If only one element and it's a static filepath, we can stop early
  const firstPath = _.first(allPaths);
  const lastPath = _.last(allPaths);
  if (firstPath == lastPath && !isGlob(firstPath)) {
    return path.dirname(firstPath);
  }

  // We get the first and last elements...
  const firstSplit = _.chain(firstPath).split('/').compact().value();
  const lastSplit = _.chain(lastPath).split('/').compact().value();

  // ...and compare their parts until they differ or we encounter a glob pattern
  let shouldBreak = false;
  const commonPrefixes = [];
  _.each(firstSplit, (value, index) => {
    if (shouldBreak) {
      return;
    }
    const isSameAsLast = lastSplit[index] == value;
    const isGlobPattern = isGlob(value);
    if (!isSameAsLast || isGlobPattern) {
      shouldBreak = true;
      return;
    }

    commonPrefixes.push(value);
  });

  return '/' + commonPrefixes.join('/');
}
