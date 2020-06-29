const callsites = require('callsites');
const path = require('path');
const pkgDir = require('pkg-dir');
const absolute = require('./absolute');

/**
 * Returns the absolute path to the current project root
 * @param {string} referenceDir Reference point to check from. Default to file
 * calling the method
 * @returns {string} Absolute filepath of the project root
 **/
module.exports = async function (referenceDir) {
  const callingPath = referenceDir
    ? absolute(referenceDir)
    : path.dirname(callsites()[1].getFileName());
  return await pkgDir(callingPath);
};
