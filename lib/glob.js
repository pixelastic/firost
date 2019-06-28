import globby from 'globby';

/**
 * Find files by globbing. Returns files in lexicographical order
 * @param {string} pattern Glob pattern to match
 * @returns {Array} Array of files matching
 **/
const module = async function glob(pattern) {
  const globbyOptions = {
    // Also return folders
    onlyFiles: false,
    // Also return hidden files
    dot: true,
  };
  const matches = await globby(pattern, globbyOptions);

  // Sort results by lexicographic order (ie. foo_2 will be before foo_10)
  return matches.sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
};

export default module;
