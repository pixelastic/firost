import module from '../unwatch';
import cache from '../cache';
import watch from '../watch';
import unwatchAll from '../unwatchAll';

describe('unwatch', () => {
  afterEach(async () => {
    await unwatchAll();
    cache.clearAll();
  });

  it('should return false if no watcher of this name', async () => {
    const actual = await module('foo');
    expect(actual).toEqual(false);
  });
  it('should kill the watcher specified by name', async () => {
    const watcher = await watch('pattern', jest.fn(), 'foo');
    jest.spyOn(watcher, 'unwatch');
    jest.spyOn(watcher, 'close');

    await module('foo');
    expect(watcher.unwatch).toHaveBeenCalledWith('pattern');
    expect(watcher.close).toHaveBeenCalled();
  });
  it('should kill the watcher specified directly', async () => {
    const watcher = await watch('pattern', jest.fn());
    jest.spyOn(watcher, 'unwatch');
    jest.spyOn(watcher, 'close');

    await module(watcher);

    expect(watcher.unwatch).toHaveBeenCalledWith('pattern');
    expect(watcher.close).toHaveBeenCalled();
  });
  it('should return true if watcher is killed', async () => {
    await watch('pattern', jest.fn(), 'foo');

    const actual = await module('foo');
    expect(actual).toEqual(true);
  });
  it('should remove the watcher from the list', async () => {
    await watch('pattern', jest.fn(), 'foo');

    const before = cache.read('watchers');
    await module('foo');
    const after = cache.read('watchers');

    expect(before).toHaveProperty('foo');
    expect(after).toEqual({});
  });
  it('should remove unnamed watcher from the list', async () => {
    const watcher = await watch('pattern', jest.fn());

    const before = cache.read('watchers');
    await module(watcher);
    const after = cache.read('watchers');

    expect(before).toHaveProperty('watcher_1');
    expect(after).toEqual({});
  });
});
