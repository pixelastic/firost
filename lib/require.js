const _ = require('golgoth/lib/_');
const callsites = require('callsites');
const path = require('path');
const clearModule = require('clear-module');

/**
 * Wrapper around the raw require() call
 * @param {string} userModuleIdentifier Module identifier
 * @param {object} userOptions Options to change behavior:
 * - forceReload {boolean} If set to true, will force reloading the module and
 *   not used the cached singleton. Default: false
 * @returns {*} Module content
 **/
function firostRequire(userModuleIdentifier, userOptions = {}) {
  const options = {
    forceReload: false,
    ...userOptions,
  };

  let moduleIdentifier = userModuleIdentifier;

  // Converting relative paths to absolute
  if (moduleIdentifier.startsWith('.')) {
    const callingFile = callsites()[1].getFileName();
    const callingPath = path.dirname(callingFile);
    moduleIdentifier = path.resolve(callingPath, moduleIdentifier);
  }

  // Bust cache if forceReload is set to true
  if (options.forceReload) {
    firostRequire.__clearCache(moduleIdentifier);
  }

  const result = firostRequire.__require(moduleIdentifier);

  // Works both with export defaults and module.exports
  return _.get(result, 'default', result);
}

firostRequire.__require = require;
firostRequire.__clearCache = clearModule.single;

module.exports = firostRequire;
