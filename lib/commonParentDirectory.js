import path from 'node:path';
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

  const firstPath = _.first(allPaths);
  const lastPath = _.last(allPaths);
  if (firstPath == lastPath) {
    return path.dirname(firstPath);
  }

  const firstSplit = _.chain(firstPath).split('/').compact().value();
  const lastSplit = _.chain(lastPath).split('/').compact().value();

  return (
    '/' +
    _.chain(firstSplit)
      .reduce((accumulator, value, index) => {
        const isSameAsLast = lastSplit[index] == value;
        if (isSameAsLast) {
          accumulator.push(value);
        }
        return accumulator;
      }, [])
      .join('/')
      .value()
  );
}
