const current = require('../unwatch');
const cache = require('../cache');
const watch = require('../watch');
const unwatchAll = require('../unwatchAll');

describe('unwatch', () => {
  afterEach(async () => {
    await unwatchAll();
    cache.clearAll();
  });

  it('should return false if no watcher of this name', async () => {
    const actual = await current('foo');
    expect(actual).toEqual(false);
  });
  it('should kill the watcher specified by name', async () => {
    const watcher = await watch('pattern', jest.fn(), 'foo');
    jest.spyOn(watcher, 'close');

    await current('foo');
    expect(watcher.close).toHaveBeenCalled();
  });
  it('should kill the watcher specified directly', async () => {
    const watcher = await watch('pattern', jest.fn());
    jest.spyOn(watcher, 'close');

    await current(watcher);

    expect(watcher.close).toHaveBeenCalled();
  });
  it('should return true if watcher is killed', async () => {
    await watch('pattern', jest.fn(), 'foo');

    const actual = await current('foo');
    expect(actual).toEqual(true);
  });
  it('should remove the watcher from the list', async () => {
    await watch('pattern', jest.fn(), 'foo');

    const before = cache.read('watchers');
    await current('foo');
    const after = cache.read('watchers');

    expect(before).toHaveProperty('foo');
    expect(after).toEqual({});
  });
  it('should remove unnamed watcher from the list', async () => {
    const watcher = await watch('pattern', jest.fn());

    const before = cache.read('watchers');
    await current(watcher);
    const after = cache.read('watchers');

    expect(before).toHaveProperty('watcher_1');
    expect(after).toEqual({});
  });
});
