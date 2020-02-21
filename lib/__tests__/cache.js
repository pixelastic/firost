const module = require('../cache');

describe('cache', () => {
  beforeEach(() => {
    module.clearAll();
  });
  describe('raw', () => {
    it('should return the whole data object', () => {
      module.write('key', 'value');
      const actual = module.raw();

      expect(actual).toEqual({ key: 'value' });
    });
    it('should return a copy and not a reference', () => {
      module.write('key', 'foo');
      const raw = module.raw();
      raw.key = 'bar';

      const actual = module.raw();

      expect(actual).toEqual({ key: 'foo' });
    });
  });
  describe('clearAll', () => {
    it('should clear all keys', () => {
      module.write('key', 'value');
      module.write('key2', 'value2');
      module.clearAll();

      expect(module.raw()).toEqual({});
    });
  });
  describe('clear', () => {
    it('should remove the key', () => {
      module.write('key', 'value');
      module.clear('key');
      const actual = module.raw();

      expect(actual).toEqual({});
    });
    it('should remove deep keys', () => {
      module.write('key.foo', 'foo');
      module.write('key.bar', 'bar');
      module.clear('key.foo');
      const actual = module.raw();

      expect(actual).toEqual({ key: { bar: 'bar' } });
    });
  });
  describe('write', () => {
    it('should write value in __data', () => {
      module.write('key', 'value');
      expect(module.read('key')).toEqual('value');
    });
    it('should write value deep', () => {
      module.write('key.one', 1);
      module.write('key.two', 2);
      expect(module.read('key')).toEqual({ one: 1, two: 2 });
    });
    it('should return the set value', () => {
      const actual = module.write('foo', 'bar');
      expect(actual).toEqual('bar');
    });
  });
  describe('has', () => {
    it('should return true if key as a value', () => {
      module.write('foo', 42);
      const actual = module.has('foo');
      expect(actual).toEqual(true);
    });
    it('should return true if key is a deep object', () => {
      module.write('foo', { foo: 42 });
      const actual = module.has('foo');
      expect(actual).toEqual(true);
    });
    it('should return true if key equals false', () => {
      module.write('foo', false);
      const actual = module.has('foo');
      expect(actual).toEqual(true);
    });
    it('should return true if key equals undefined', () => {
      module.write('foo', undefined);
      const actual = module.has('foo');
      expect(actual).toEqual(true);
    });
    it('should return false if key does not exist', () => {
      module.write('foo', 42);
      const actual = module.has('bar');
      expect(actual).toEqual(false);
    });
  });
  describe('read', () => {
    it('should return the value', () => {
      module.write('key', 'value');
      const actual = module.read('key');
      expect(actual).toEqual('value');
    });
    it('should return undefined if no value', () => {
      const actual = module.read('key');
      expect(actual).toEqual(undefined);
    });
    it('should allow passing a default value if nothing in cache', () => {
      const actual = module.read('key', 'default');
      expect(actual).toEqual('default');
    });
    it('should not return default value if value is false', () => {
      module.write('key', false);
      const actual = module.read('key', 'default');
      expect(actual).toEqual(false);
    });
    it('should not return default value if value is undefined', () => {
      module.write('key', undefined);
      const actual = module.read('key', 'default');
      expect(actual).toEqual(undefined);
    });
    it('should return a copy of the value and not a reference', () => {
      module.write('foo', { foo: 'bar' });
      module.write({ foo: 'bar' }, 'foo');
      const read = module.read('foo');
      read.foo = 'baz';

      const actual = module.read('foo');
      expect(actual).toEqual({ foo: 'bar' });
    });
  });
});
