const current = require('../cache');

describe('cache', () => {
  beforeEach(() => {
    current.clearAll();
  });
  describe('raw', () => {
    it('should return the whole data object', () => {
      current.write('key', 'value');
      const actual = current.raw();

      expect(actual).toEqual({ key: 'value' });
    });
    it('should return a copy and not a reference', () => {
      current.write('key', 'foo');
      const raw = current.raw();
      raw.key = 'bar';

      const actual = current.raw();

      expect(actual).toEqual({ key: 'foo' });
    });
  });
  describe('clearAll', () => {
    it('should clear all keys', () => {
      current.write('key', 'value');
      current.write('key2', 'value2');
      current.clearAll();

      expect(current.raw()).toEqual({});
    });
  });
  describe('clear', () => {
    it('should remove the key', () => {
      current.write('key', 'value');
      current.clear('key');
      const actual = current.raw();

      expect(actual).toEqual({});
    });
    it('should remove deep keys', () => {
      current.write('key.foo', 'foo');
      current.write('key.bar', 'bar');
      current.clear('key.foo');
      const actual = current.raw();

      expect(actual).toEqual({ key: { bar: 'bar' } });
    });
  });
  describe('write', () => {
    it('should write value in __data', () => {
      current.write('key', 'value');
      expect(current.read('key')).toEqual('value');
    });
    it('should write value deep', () => {
      current.write('key.one', 1);
      current.write('key.two', 2);
      expect(current.read('key')).toEqual({ one: 1, two: 2 });
    });
    it('should return the set value', () => {
      const actual = current.write('foo', 'bar');
      expect(actual).toEqual('bar');
    });
  });
  describe('has', () => {
    it('should return true if key as a value', () => {
      current.write('foo', 42);
      const actual = current.has('foo');
      expect(actual).toEqual(true);
    });
    it('should return true if key is a deep object', () => {
      current.write('foo', { foo: 42 });
      const actual = current.has('foo');
      expect(actual).toEqual(true);
    });
    it('should return true if key equals false', () => {
      current.write('foo', false);
      const actual = current.has('foo');
      expect(actual).toEqual(true);
    });
    it('should return true if key equals undefined', () => {
      current.write('foo', undefined);
      const actual = current.has('foo');
      expect(actual).toEqual(true);
    });
    it('should return false if key does not exist', () => {
      current.write('foo', 42);
      const actual = current.has('bar');
      expect(actual).toEqual(false);
    });
  });
  describe('read', () => {
    it('should return the value', () => {
      current.write('key', 'value');
      const actual = current.read('key');
      expect(actual).toEqual('value');
    });
    it('should return undefined if no value', () => {
      const actual = current.read('key');
      expect(actual).toEqual(undefined);
    });
    it('should allow passing a default value if nothing in cache', () => {
      const actual = current.read('key', 'default');
      expect(actual).toEqual('default');
    });
    it('should not return default value if value is false', () => {
      current.write('key', false);
      const actual = current.read('key', 'default');
      expect(actual).toEqual(false);
    });
    it('should not return default value if value is undefined', () => {
      current.write('key', undefined);
      const actual = current.read('key', 'default');
      expect(actual).toEqual(undefined);
    });
    it('should return a copy of the value and not a reference', () => {
      current.write('foo', { foo: 'bar' });
      current.write({ foo: 'bar' }, 'foo');
      const read = current.read('foo');
      read.foo = 'baz';

      const actual = current.read('foo');
      expect(actual).toEqual({ foo: 'bar' });
    });
  });
});
