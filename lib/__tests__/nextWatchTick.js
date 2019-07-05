import module from '../nextWatchTick';
import unwatchAll from '../unwatchAll';
import cache from '../cache';
import watch from '../watch';

describe('watch', () => {
  afterEach(async () => {
    await unwatchAll();
    cache.clearAll();
  });
  it('should return quickly if no watchers currently pending', async () => {
    const before = new Date();
    await module();
    const after = new Date();

    expect(after - before).toBeLessThan(10);
  });
  it('should wait for one watcher tick', async () => {
    const watcher = await watch('pattern', jest.fn());
    const interval = watcher.options.interval;

    const before = new Date();
    await module();
    const after = new Date();

    expect(after - before).toBeGreaterThanOrEqual(interval);
  });
});
