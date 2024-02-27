import current from '../unwatchAll.js';
import cache from '../cache.js';
import watch from '../watch.js';

describe('unwatchAll', () => {
  beforeEach(async () => {
    cache.clearAll();
  });
  it('should kill all unnamed watchers', async () => {
    const watcher1 = await watch('pattern', vi.fn());
    const watcher2 = await watch('pattern', vi.fn());

    expect(watcher1).toHaveProperty('closed', false);
    expect(watcher2).toHaveProperty('closed', false);

    await current('foo');

    expect(watcher1).toHaveProperty('closed', true);
    expect(watcher2).toHaveProperty('closed', true);
  });
  it('should clear the watchers list', async () => {
    await watch('pattern', vi.fn());
    await watch('pattern', vi.fn());

    const before = cache.read('watchers');
    await current('foo');
    const after = cache.read('watchers');

    expect(before).toHaveProperty('watcher_1');
    expect(before).toHaveProperty('watcher_2');
    expect(after).toEqual({});
  });
});
