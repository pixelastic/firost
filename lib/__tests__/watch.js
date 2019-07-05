import module from '../watch';
import copy from '../copy';
import write from '../write';
import remove from '../remove';
import helper from '../test-helper';
import cache from '../cache';
import unwatchAll from '../unwatchAll';
import nextWatchTick from '../nextWatchTick';
const fixturePath = helper.fixturePath();
const tmpPath = helper.tmpPath('watch');

describe('watch', () => {
  afterEach(async () => {
    await unwatchAll();
    cache.clearAll();
  });
  describe('with real files', () => {
    beforeAll(async () => {
      await helper.clearTmpDirectory('watch');
      await copy(`${fixturePath}/*`, tmpPath);
    });
    it('should fire when file is modified', async () => {
      const pattern = `${tmpPath}/foo*`;
      const target = `${tmpPath}/foo_10`;
      const callback = jest.fn();
      await module(pattern, callback);

      await write('foo', target);

      await nextWatchTick();
      expect(callback).toHaveBeenCalledWith(target, 'modified');
    });
    it('should fire when file is added', async () => {
      const pattern = `${tmpPath}/foo*`;
      const target = `${tmpPath}/foo_new`;
      const callback = jest.fn();
      await module(pattern, callback, 'foo');

      await write('foo', target);

      await nextWatchTick();
      expect(callback).toHaveBeenCalledWith(target, 'created');
    });
    it('should fire when file is deleted', async () => {
      const pattern = `${tmpPath}/foo*`;
      const target = `${tmpPath}/foo_10`;
      const callback = jest.fn();
      await module(pattern, callback);

      await remove(target);

      await nextWatchTick();
      expect(callback).toHaveBeenCalledWith(target, 'removed');
    });
    it('should not fire for existing files at startup', async () => {
      const pattern = `${tmpPath}/foo*`;
      const callback = jest.fn();
      await module(pattern, callback);

      await nextWatchTick();
      expect(callback).not.toHaveBeenCalled();
    });
  });
  it('should store watcher name and pattern in watcher', async () => {
    const actual = await module('pattern', jest.fn(), 'name');

    expect(actual).toHaveProperty('firostData.pattern', 'pattern');
    expect(actual).toHaveProperty('firostData.name', 'name');
  });
  it('should save the watcher with counter name', async () => {
    const watcher = await module('pattern', jest.fn());

    const actual = cache.read('watchers');

    expect(actual).toHaveProperty('watcher_1', watcher);
  });
  it('should save the watcher with specific name', async () => {
    const watcher = await module('pattern', jest.fn(), 'foo');

    const actual = cache.read('watchers');

    expect(actual).toHaveProperty('foo', watcher);
  });
});
