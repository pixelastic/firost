const current = require('../waitForWatchers');
const unwatchAll = require('../unwatchAll');
const cache = require('../cache');
const sleep = require('../sleep');
const watch = require('../watch');
const write = require('../write');
const emptyDir = require('../emptyDir');

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
    const watcher = await watch('pattern', jest.fn());
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
      const callback = jest.fn().mockImplementation(async () => {
        await sleep(200);
        actual = true;
      });

      await watch(`${tmpDir}/foo*`, callback);
      await write('foo bar', `${tmpDir}/foo.txt`);

      await current();

      expect(actual).toEqual(true);
    });
  });
});
