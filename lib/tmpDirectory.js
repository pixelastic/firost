const tempy = require('tempy');
const path = require('path');
/**
 * Return the path to a temporary folder
 * @param {string} scope Optional subdirectories in the tmp folder
 * @returns {string} Filepath to the temp directory
 **/
module.exports = function (scope = false) {
  const fullDirectory = tempy.directory();
  if (!scope) {
    return fullDirectory;
  }

  const root = tempy.root;
  const relativeDirectory = path.relative(root, fullDirectory);
  return path.resolve(root, scope, relativeDirectory);
};
