const globby = require('globby');

/**
 * Find files by globbing. Returns files in lexicographical order
 * @param {string} pattern Glob pattern to match
 * @param {object} userOptions Options to configure the matching:
 * - directories {boolean} (default: true) Includes directories in the results
 * - hiddenFiles {boolean} (default: true) Includes hidden files in the results
 * @returns {Array} Array of files matching
 **/
module.exports = async function glob(pattern, userOptions = {}) {
  const options = {
    directories: true,
    hiddenFiles: true,
    ...userOptions,
  };
  const globbyOptions = {
    onlyFiles: !options.directories,
    dot: options.hiddenFiles,
  };
  const matches = await globby(pattern, globbyOptions);

  // Sort results by lexicographic order (ie. foo_2 will be before foo_10)
  return matches.sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
};
