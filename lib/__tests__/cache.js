import { cache } from '../cache.js';

describe('cache', () => {
  beforeEach(() => {
    cache.clearAll();
  });
  describe('raw', () => {
    it('should return the whole data object', () => {
      cache.write('key', 'value');
      const actual = cache.raw();

      expect(actual).toEqual({ key: 'value' });
    });
    it('should return a copy and not a reference', () => {
      cache.write('key', 'foo');
      const raw = cache.raw();
      raw.key = 'bar';

      const actual = cache.raw();

      expect(actual).toEqual({ key: 'foo' });
    });
  });
  describe('clearAll', () => {
    it('should clear all keys', () => {
      cache.write('key', 'value');
      cache.write('key2', 'value2');
      cache.clearAll();

      expect(cache.raw()).toEqual({});
    });
  });
  describe('clear', () => {
    it('should remove the key', () => {
      cache.write('key', 'value');
      cache.clear('key');
      const actual = cache.raw();

      expect(actual).toEqual({});
    });
    it('should remove deep keys', () => {
      cache.write('key.foo', 'foo');
      cache.write('key.bar', 'bar');
      cache.clear('key.foo');
      const actual = cache.raw();

      expect(actual).toEqual({ key: { bar: 'bar' } });
    });
  });
  describe('write', () => {
    it('should write value in __data', () => {
      cache.write('key', 'value');
      expect(cache.read('key')).toBe('value');
    });
    it('should write value deep', () => {
      cache.write('key.one', 1);
      cache.write('key.two', 2);
      expect(cache.read('key')).toEqual({ one: 1, two: 2 });
    });
    it('should return the set value', () => {
      const actual = cache.write('foo', 'bar');
      expect(actual).toBe('bar');
    });
  });
  describe('has', () => {
    it('should return true if key as a value', () => {
      cache.write('foo', 42);
      const actual = cache.has('foo');
      expect(actual).toBe(true);
    });
    it('should return true if key is a deep object', () => {
      cache.write('foo', { foo: 42 });
      const actual = cache.has('foo');
      expect(actual).toBe(true);
    });
    it('should return true if key equals false', () => {
      cache.write('foo', false);
      const actual = cache.has('foo');
      expect(actual).toBe(true);
    });
    it('should return true if key equals undefined', () => {
      cache.write('foo', undefined);
      const actual = cache.has('foo');
      expect(actual).toBe(true);
    });
    it('should return false if key does not exist', () => {
      cache.write('foo', 42);
      const actual = cache.has('bar');
      expect(actual).toBe(false);
    });
  });
  describe('read', () => {
    it('should return the value', () => {
      cache.write('key', 'value');
      const actual = cache.read('key');
      expect(actual).toBe('value');
    });
    it('should return undefined if no value', () => {
      const actual = cache.read('key');
      expect(actual).toBeUndefined();
    });
    it('should allow passing a default value if nothing in cache', () => {
      const actual = cache.read('key', 'default');
      expect(actual).toBe('default');
    });
    it('should not return default value if value is false', () => {
      cache.write('key', false);
      const actual = cache.read('key', 'default');
      expect(actual).toBe(false);
    });
    it('should not return default value if value is undefined', () => {
      cache.write('key', undefined);
      const actual = cache.read('key', 'default');
      expect(actual).toBeUndefined();
    });
    it('should return a copy of the value and not a reference', () => {
      cache.write('foo', { foo: 'bar' });
      cache.write({ foo: 'bar' }, 'foo');
      const read = cache.read('foo');
      read.foo = 'baz';

      const actual = cache.read('foo');
      expect(actual).toEqual({ foo: 'bar' });
    });
  });
});
