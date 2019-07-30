import module from '../watch';
import write from '../write';
import remove from '../remove';
import helper from '../test-helper';
import cache from '../cache';
import sleep from '../sleep';
import unwatchAll from '../unwatchAll';
import waitForWatchers from '../waitForWatchers';
const tmpPath = helper.tmpPath('watch');

describe('watch', () => {
  afterEach(async () => {
    await unwatchAll();
    cache.clearAll();
  });
  describe('with real files', () => {
    beforeEach(async () => {
      await helper.clearTmpDirectory('watch');
    });
    it('should fire when file is added', async () => {
      const pattern = `${tmpPath}/foo*`;
      const target = `${tmpPath}/foo_new`;
      const callback = jest.fn();
      await module(pattern, callback);

      await write('foo', target);

      await waitForWatchers();
      expect(callback).toHaveBeenCalledWith(target, 'created');
    });
    it('should fire when file is modified', async () => {
      const pattern = `${tmpPath}/foo*`;
      const target = `${tmpPath}/foo_modified`;
      const callback = jest.fn();
      await write('foo', target);
      await module(pattern, callback);

      await write('foo', target);

      await waitForWatchers();
      expect(callback).toHaveBeenCalledWith(target, 'modified');
    });
    it('should fire when file is deleted', async () => {
      const pattern = `${tmpPath}/foo*`;
      const target = `${tmpPath}/foo_delete`;
      const callback = jest.fn();
      await write('foo', target);
      await module(pattern, callback);

      await remove(target);

      await waitForWatchers();
      expect(callback).toHaveBeenCalledWith(target, 'removed');
    });
    it('should not fire for existing files at startup', async () => {
      const pattern = `${tmpPath}/foo*`;
      const callback = jest.fn();
      await module(pattern, callback);

      await waitForWatchers();
      expect(callback).not.toHaveBeenCalled();
    });
    it('should allow passing several patterns', async () => {
      const pattern = [`${tmpPath}/foo*`, `${tmpPath}/bar*`];
      const target = `${tmpPath}/bar_new`;
      const callback = jest.fn();
      await module(pattern, callback);

      await write('foo', target);

      await waitForWatchers();
      expect(callback).toHaveBeenCalledWith(target, 'created');
    });
    it('should mark callback as running when called', async () => {
      const pattern = `${tmpPath}/foo*`;
      const target = `${tmpPath}/foo_10`;
      jest.spyOn(cache, 'write');
      // Make a callback that takes some time to execute
      const callback = jest.fn().mockImplementation(async () => {
        await sleep(200);
      });
      // We need to define its own name so watcherCounter is not incremented in
      // cache and breaking the test
      const watcherName = `watcher_${new Date().getTime()}`;
      await module(pattern, callback, watcherName);

      // Trigger the callback
      await write('foo', target);

      // Wait to make sure the callback has time to run
      await waitForWatchers();

      const calls = cache.write.mock.calls;
      const firstCall = calls[0];
      const secondCall = calls[1];
      const thirdCall = calls[2];
      // Should be initialized with isRunning: false
      expect(firstCall).toEqual([
        `watchers.${watcherName}`,
        expect.objectContaining({ isRunning: false }),
      ]);
      // Should set it to true, then false again
      expect(secondCall).toEqual([`watchers.${watcherName}.isRunning`, true]);
      expect(thirdCall).toEqual([`watchers.${watcherName}.isRunning`, false]);
    });
    describe('in new dir', () => {
      it('should fire for specific file created', async () => {
        const pattern = `${tmpPath}/foo/file.json`;
        const target = `${tmpPath}/foo/file.json`;
        const callback = jest.fn();
        await module(pattern, callback);

        await write('foo', target);

        await waitForWatchers();
        expect(callback).toHaveBeenCalledWith(target, 'created');
      });
      it('should fire for glob file created', async () => {
        const pattern = `${tmpPath}/foo/*.json`;
        const target = `${tmpPath}/foo/file.json`;
        const callback = jest.fn();
        await module(pattern, callback);

        await write('foo', target);

        await waitForWatchers();
        expect(callback).toHaveBeenCalledWith(target, 'created');
      });
      it('should fire for deep glob file created', async () => {
        const pattern = `${tmpPath}/foo/**/*.json`;
        const target = `${tmpPath}/foo/bar/baz/file.json`;
        const callback = jest.fn();
        await module(pattern, callback);

        await write('foo', target);

        await waitForWatchers();
        expect(callback).toHaveBeenCalledWith(target, 'created');
      });
      it('should fire for multiple patterns passed', async () => {
        const pattern = [
          `${tmpPath}/foo/file.json`,
          `${tmpPath}/bar/file.json`,
        ];
        const target = `${tmpPath}/bar/file.json`;
        const callback = jest.fn();
        await module(pattern, callback);

        await write('foo', target);

        await waitForWatchers();
        expect(callback).toHaveBeenCalledWith(target, 'created');
      });
    });
  });
  it('should store watcher name in the watcher', async () => {
    const actual = await module('pattern', jest.fn(), 'name');

    expect(actual).toHaveProperty('firostName', 'name');
  });
  it('should save the watcher name in cache', async () => {
    await module('pattern', jest.fn(), 'myWatcher');

    const actual = cache.read('watchers');

    expect(actual).toHaveProperty('myWatcher.name', 'myWatcher');
  });
  it('should save the watcher in cache', async () => {
    const watcher = await module('pattern', jest.fn());

    const actual = cache.read('watchers');

    expect(actual).toHaveProperty('watcher_1.watcher', watcher);
  });
  it('should save the watcher with specific name', async () => {
    const watcher = await module('pattern', jest.fn(), 'foo');

    const actual = cache.read('watchers');

    expect(actual).toHaveProperty('foo.watcher', watcher);
  });
});
