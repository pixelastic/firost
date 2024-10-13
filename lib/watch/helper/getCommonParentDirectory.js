import path from 'path';
import { _ } from 'golgoth';
import isGlob from 'is-glob';
import exist from '../../exist.js';

/**
 * Returns the theoretical closest common parent directory.
 * This will be the common prefix between the first and last filepaths, in
 * alphabetical order
 * @param {Array} filepaths List of filepaths
 * @returns {string} Closest theoretical common parent directory
 */
function getStaticCommonParentDirectory(filepaths) {
  const sortedList = filepaths.sort();

  // Special case:
  // Only one element given, and it's a static filepath, so the ancestor is
  // its parent directory
  if (sortedList.length == 1 && !isGlob(sortedList[0])) {
    return path.dirname(sortedList[0]);
  }

  const first = _.chain(sortedList).first().split('/').compact().value();
  const last = _.chain(sortedList).last().split('/').compact().value();

  return (
    '/' +
    _.chain(first)
      .reduce((accumulator, value, index) => {
        // If it's common between the first and last, and is not a glob pattern,
        // we keep the path part to build the final result
        const isSameAsLast = last[index] == value;
        const isGlobPattern = isGlob(value);
        if (isSameAsLast && !isGlobPattern) {
          accumulator.push(value);
        }
        return accumulator;
      }, [])
      .join('/')
      .value()
  );
}

/**
 * Returns the deepest directory that actually exist on disk from a given
 * filepath
 * @param {string} filepath Filepath directory to test
 * @returns {string} Filepath to an existing directory
 */
async function getRealDeepestExistingDirectory(filepath) {
  if (await exist(filepath)) {
    return filepath;
  }
  return await getRealDeepestExistingDirectory(path.dirname(filepath));
}

/**
 * Find the only common path ancestor from a list of filepaths
 * @param {Array} rawInput List of filepaths and/or glob patterns
 * @returns {string} Single unique common ancestor directory of all inputs
 **/
export default async function (rawInput) {
  const filepaths = _.castArray(rawInput);

  const theoreticalCommonParentDirectory =
    getStaticCommonParentDirectory(filepaths);
  const realCommonParentDirectory = await getRealDeepestExistingDirectory(
    theoreticalCommonParentDirectory,
  );

  return realCommonParentDirectory;
}
