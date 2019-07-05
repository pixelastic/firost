import module from '../watch';
import copy from '../copy';
import write from '../write';
import remove from '../remove';
import helper from '../test-helper';
import cache from '../cache';
import unwatchAll from '../unwatchAll';
const fixturePath = helper.fixturePath();
const tmpPath = helper.tmpPath('watch');

describe('watch', () => {
  afterEach(async () => {
    await unwatchAll();
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
      const watcher = await module(pattern, callback);

      await write('foo', target);

      await watcher.__forceWaitOneCycle();
      expect(callback).toHaveBeenCalledWith(target, 'modified');
    });
    it('should fire when file is added', async () => {
      const pattern = `${tmpPath}/foo*`;
      const target = `${tmpPath}/foo_new`;
      const callback = jest.fn();
      const watcher = await module(pattern, callback, 'foo');

      await write('foo', target);

      await watcher.__forceWaitOneCycle();
      expect(callback).toHaveBeenCalledWith(target, 'created');
    });
    it('should fire when file is deleted', async () => {
      const pattern = `${tmpPath}/foo*`;
      const target = `${tmpPath}/foo_10`;
      const callback = jest.fn();
      const watcher = await module(pattern, callback);

      await remove(target);

      await watcher.__forceWaitOneCycle();
      expect(callback).toHaveBeenCalledWith(target, 'removed');
    });
    it('should not fire for existing files at startup', async () => {
      const pattern = `${tmpPath}/foo*`;
      const callback = jest.fn();
      const watcher = await module(pattern, callback);

      await watcher.__forceWaitOneCycle();
      expect(callback).not.toHaveBeenCalled();
    });
  });
  describe('cached watchers', () => {
    it('should save the watcher in a shared list', async () => {
      const pattern = `${tmpPath}/foo*`;
      const callback = jest.fn();
      const watcher1 = await module(pattern, callback);
      const watcher2 = await module(pattern, callback);

      const actual = cache.read('watchers.raw');

      expect(actual[0]).toEqual(watcher1);
      expect(actual[1]).toEqual(watcher2);
    });
    it('should save named watchers in specific list', async () => {
      const pattern = `${tmpPath}/foo*`;
      const callback = jest.fn();
      const watcher = await module(pattern, callback, 'foo');

      const actual = cache.read('watchers.named.foo');

      expect(actual).toEqual(watcher);
    });
  });
  describe('__kill', () => {
    it('should unwatch and close the watcher', async () => {
      const pattern = `${tmpPath}/foo*`;
      const callback = jest.fn();
      const watcher = await module(pattern, callback);
      jest.spyOn(watcher, 'unwatch');
      jest.spyOn(watcher, 'close');

      watcher.__kill();

      expect(watcher.unwatch).toHaveBeenCalledWith(pattern);
      expect(watcher.close).toHaveBeenCalled();
    });
  });
});
