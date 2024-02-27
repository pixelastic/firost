import current from '../waitForWatchers.js';
import unwatchAll from '../unwatchAll.js';
import cache from '../cache.js';
import sleep from '../sleep.js';
import watch from '../watch.js';
import write from '../write.js';
import emptyDir from '../emptyDir.js';

describe('waitForWatchers', () => {
  afterEach(async () => {
    await unwatchAll();
    cache.clearAll();
  });
  it('should return quickly if no watchers currently pending', async () => {
    const before = new Date();
    await current();
    const after = new Date();

    expect(after - before).toBeLessThan(10);
  });
  it('should wait for at least one watcher tick', async () => {
    const watcher = await watch('pattern', vi.fn());
    const interval = watcher.options.interval;

    const before = new Date();
    await current();
    const after = new Date();

    expect(after - before).toBeGreaterThanOrEqual(interval);
  });
  describe('with real files', () => {
    const tmpDir = './tmp/waitForWatchers';
    beforeEach(async () => {
      await emptyDir(tmpDir);
    });
    it('should wait for the callbacks to finish', async () => {
      let actual = false;
      const callback = vi.fn().mockImplementation(async () => {
        await sleep(200);
        actual = true;
      });

      await watch(`${tmpDir}/foo*`, callback);
      await write('foo bar', `${tmpDir}/foo.txt`);

      await current();

      expect(actual).toBe(true);
    });
  });
});
