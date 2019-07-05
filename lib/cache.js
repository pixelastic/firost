import { _ } from 'golgoth';

export default {
  __data: {},
  has(key) {
    return _.has(this.__data, key);
  },
  read(key, defaultValue = undefined) {
    if (!this.has(key)) {
      return defaultValue;
    }
    return _.clone(_.get(this.__data, key));
  },
  write(value, key) {
    _.set(this.__data, key, value);
  },
  clear(key) {
    _.unset(this.__data, key);
  },
  clearAll() {
    this.__data = {};
  },
  raw() {
    return this.__data;
  },
};
