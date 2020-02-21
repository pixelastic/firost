const _ = require('golgoth/lib/_');

/**
 * Wrapper around the raw require() call
 * Works with both export defaul and module.exports
 * Allow passing a { forceReload: true } option to force reloading from the cache
 * WARNING: It does not handle relative paths. All paths should be absolute
 * @param {string} id Module identifier
 * @param {object} userOptions Options to change behavior:
 * - forceReload {boolean} If set to true, will force reloading the module and
 *   not used the cached singleton. Default: false
 * @returns {*} Module content
 **/
module.exports = function(id, userOptions = {}) {
  const options = {
    forceReload: false,
    ...userOptions,
  };

  // Bust cache if forceReload is set to true
  if (options.forceReload) {
    delete require.cache[id];
  }

  const result = this.__require(id);

  // Works both with export defaults and module.exports
  return _.get(result, 'default', result);
};

/**
 * Wrapper around the real require() call to make it easier to mock in tests
 * @param {string} id Module identifier
 * @returns {*} Imported module
 **/
module.exports.__require = function(id) {
  return require(id);
};
