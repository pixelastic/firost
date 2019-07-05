import module from '../cache';

describe('cache', () => {
  beforeEach(() => {
    module.clearAll();
  });
  describe('raw', () => {
    it('should return the whole data object', () => {
      module.write('value', 'key');
      const actual = module.raw();

      expect(actual).toEqual({ key: 'value' });
    });
  });
  describe('clearAll', () => {
    it('should clear all keys', () => {
      module.write('value', 'key');
      module.write('value2', 'key2');
      module.clearAll();

      expect(module.raw()).toEqual({});
    });
  });
  describe('clear', () => {
    it('should remove the key', () => {
      module.write('value', 'key');
      module.clear('key');
      const actual = module.raw();

      expect(actual).toEqual({});
    });
    it('should remove deep keys', () => {
      module.write('foo', 'key.foo');
      module.write('bar', 'key.bar');
      module.clear('key.foo');
      const actual = module.raw();

      expect(actual).toEqual({ key: { bar: 'bar' } });
    });
  });
  describe('write', () => {
    it('should write value in __data', () => {
      module.write('value', 'key');
      expect(module.read('key')).toEqual('value');
    });
    it('should write value deep', () => {
      module.write(1, 'value.one');
      module.write(2, 'value.two');
      expect(module.read('value')).toEqual({ one: 1, two: 2 });
    });
  });
  describe('has', () => {
    it('should return true if key as a value', () => {
      module.write(42, 'foo');
      const actual = module.has('foo');
      expect(actual).toEqual(true);
    });
    it('should return true if key is a deep object', () => {
      module.write({ foo: 42 }, 'foo');
      const actual = module.has('foo');
      expect(actual).toEqual(true);
    });
    it('should return true if key equals false', () => {
      module.write(false, 'foo');
      const actual = module.has('foo');
      expect(actual).toEqual(true);
    });
    it('should return true if key equals undefined', () => {
      module.write(undefined, 'foo');
      const actual = module.has('foo');
      expect(actual).toEqual(true);
    });
    it('should return false if key does not exist', () => {
      module.write(42, 'foo');
      const actual = module.has('bar');
      expect(actual).toEqual(false);
    });
  });
  describe('read', () => {
    it('should return the value', () => {
      module.write('value', 'key');
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
      module.write(false, 'key');
      const actual = module.read('key', 'default');
      expect(actual).toEqual(false);
    });
    it('should not return default value if value is undefined', () => {
      module.write(undefined, 'key');
      const actual = module.read('key', 'default');
      expect(actual).toEqual(undefined);
    });
    it('should return a copy of the value and not a reference', () => {
      module.write({ foo: 'bar' }, 'foo');
      const read = module.read('foo');
      read.foo = 'baz';

      const actual = module.read('foo');
      expect(actual).toEqual({ foo: 'bar' });
    });
  });
});
