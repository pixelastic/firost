import { _ } from 'golgoth';
import callerPath from 'caller-path';
import path from 'path';

/**
 * Wrapper around the raw require() call
 * Works with both export defaul and module.exports
 * Allow passing a { forceReload: true } option to force reloading from the cache
 * @param {string} suppliedId Module identifier
 * @param {object} userOptions Options to change behavior:
 * - forceReload {boolean} If set to true, will force reloading the module and
 *   not used the cached singleton. Default: false
 * @returns {*} Module content
 **/
const module = function(suppliedId, userOptions = {}) {
  const options = {
    forceReload: false,
    ...userOptions,
  };

  let id = suppliedId;
  // Importing a relative path
  if (_.startsWith(id, '.')) {
    id = path.resolve(path.dirname(callerPath()), suppliedId);
  }

  // Bust cache if forceReload is set to true
  if (options.forceReload) {
    delete require.cache[suppliedId];
  }

  const result = module.__require(id);

  // Works both with export defaults and module.exports
  return _.get(result, 'default', result);
};

/**
 * Wrapper around the real require() call to make it easier to mock in tests
 * @param {string} id Module identifier
 * @returns {*} Imported module
 **/
module.__require = function(id) {
  return require(id);
};

export default module;
