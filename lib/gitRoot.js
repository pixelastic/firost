const callsites = require('callsites');
const path = require('path');
const findUp = require('find-up');
const absolute = require('./absolute');

/**
 * Returns the absolute path to the current git root, where the closest .git
 * folder is
 * @param {string} referenceDir Reference point to check from. Default to file
 * calling the method
 * @returns {string} Absolute filepath of the project root
 **/
module.exports = function (referenceDir) {
  const callingPath = referenceDir
    ? absolute(referenceDir)
    : path.dirname(callsites()[1].getFileName());

  const gitFolder = findUp.sync('.git', {
    type: 'directory',
    cwd: callingPath,
  });
  return path.dirname(gitFolder);
};
