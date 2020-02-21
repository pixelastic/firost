const _ = require('golgoth/lib/_');

module.exports = {
  // Internal store
  __data: {},
  /**
   * Returns true if the cache as en entry for the specific key.
   * @param {string} key Key to check
   * @returns {boolean} True if hs such a key, false otherwise
   **/
  has(key) {
    return _.has(this.__data, key);
  },
  /**
   * Returns a copy of the value stored at the specified key
   * @param {string} key Key to read
   * @param {any} defaultValue Value to return if no such key exists
   * @returns {any} Copy of the value found, or default value if not found
   **/
  read(key, defaultValue = undefined) {
    if (!this.has(key)) {
      return defaultValue;
    }
    return _.clone(_.get(this.__data, key));
  },
  /**
   * Write the specific value to the given key
   * @param {string} key Key to store it at
   * @param {any} value Value to write
   * @returns {any} The value written
   **/
  write(key, value) {
    _.set(this.__data, key, value);
    return value;
  },
  /**
   * Clear the cache at the specified value
   * @param {string} key Key to clear
   **/
  clear(key) {
    _.unset(this.__data, key);
  },
  /**
   * Clear the whole cache
   **/
  clearAll() {
    this.__data = {};
  },
  /**
   * Returns a copy of the current cache object
   * @returns {object} The whole cache object
   **/
  raw() {
    return _.clone(this.__data);
  },
};
