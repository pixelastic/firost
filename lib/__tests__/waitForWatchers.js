import module from '../waitForWatchers';
import unwatchAll from '../unwatchAll';
import cache from '../cache';
import sleep from '../sleep';
import watch from '../watch';
import helper from '../test-helper';
import copy from '../copy';
import write from '../write';
const fixturePath = helper.fixturePath();
const tmpPath = helper.tmpPath('waitForWatchers');

describe('waitForWatchers', () => {
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
  it('should wait for at least one watcher tick', async () => {
    const watcher = await watch('pattern', jest.fn());
    const interval = watcher.options.interval;

    const before = new Date();
    await module();
    const after = new Date();

    expect(after - before).toBeGreaterThanOrEqual(interval);
  });
  describe('with real files', () => {
    beforeAll(async () => {
      await helper.clearTmpDirectory('waitForWatchers');
      await copy(`${fixturePath}/foo*`, tmpPath);
    });
    it('should wait for the callbacks to finish', async () => {
      let actual = false;
      const callback = jest.fn().mockImplementation(async () => {
        await sleep(200);
        actual = true;
      });

      await watch(`${tmpPath}/foo*`, callback);
      await write('foo bar', `${tmpPath}/foo_bar`);

      await module();

      expect(actual).toEqual(true);
    });
  });
});
