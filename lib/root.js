const callsites = require('callsites');
const path = require('path');
const pkgDir = require('pkg-dir');

/**
 * Returns the absolute path to the current project root
 * @returns {string} Absolute filepath of the project root
 **/
module.exports = async function () {
  const callingFile = callsites()[1].getFileName();
  const callingPath = path.dirname(callingFile);
  return await pkgDir(callingPath);
};
