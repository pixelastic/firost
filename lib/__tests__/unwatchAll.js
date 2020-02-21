const module = jestImport('../unwatchAll');
const cache = jestImport('../cache');
const watch = jestImport('../watch');

describe('unwatchAll', () => {
  beforeEach(async () => {
    cache.clearAll();
  });
  it('should kill all unnamed watchers', async () => {
    const watcher1 = await watch('pattern', jest.fn());
    const watcher2 = await watch('pattern', jest.fn());

    expect(watcher1).toHaveProperty('closed', false);
    expect(watcher2).toHaveProperty('closed', false);

    await module('foo');

    expect(watcher1).toHaveProperty('closed', true);
    expect(watcher2).toHaveProperty('closed', true);
  });
  it('should clear the watchers list', async () => {
    await watch('pattern', jest.fn());
    await watch('pattern', jest.fn());

    const before = cache.read('watchers');
    await module('foo');
    const after = cache.read('watchers');

    expect(before).toHaveProperty('watcher_1');
    expect(before).toHaveProperty('watcher_2');
    expect(after).toEqual({});
  });
});
