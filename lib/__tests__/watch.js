import current from '../watch.js';
import write from '../write.js';
import remove from '../remove.js';
import cache from '../cache.js';
import sleep from '../sleep.js';
import unwatchAll from '../unwatchAll.js';
import waitForWatchers from '../waitForWatchers.js';
import emptyDir from '../emptyDir.js';
import path from 'path';

describe('watch', () => {
  const tmpDir = './tmp/watch';
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  describe('fixPattern', () => {
    it('should keep paths absolute if given as absolute', async () => {
      const pattern = path.resolve(`${tmpDir}/foo.txt`);
      await write('foo', pattern);

      const actual = await current.fixPattern(pattern);

      expect(actual).toEqual(pattern);
    });
    it('should keep path relatives if given as relative', async () => {
      const pattern = `${tmpDir}/foo.txt`;
      await write('foo', pattern);

      const actual = await current.fixPattern(pattern);

      expect(actual).toEqual(pattern);
    });
    it('should replace non-existing dirs with regexp still matching', async () => {
      const pattern = `${tmpDir}/nope/*.txt`;

      const actual = await current.fixPattern(pattern);

      expect(actual).toBe(`${tmpDir}/(nope|$*)/*.txt`);
    });
    it('should fix all patterns in an array', async () => {
      await write('foo', `${tmpDir}/foo.txt`);

      const actual = await current.fixPattern([
        `${tmpDir}/nope/*.txt`,
        `${tmpDir}/*.txt`,
      ]);

      expect(actual[0]).toBe(`${tmpDir}/(nope|$*)/*.txt`);
      expect(actual[1]).toBe(`${tmpDir}/*.txt`);
    });
    it('should not remove negating pattern', async () => {
      await write('foo', `${tmpDir}/foo.txt`);

      const actual = await current.fixPattern([
        `${tmpDir}/**/*.txt`,
        `!${tmpDir}/nope.txt`,
      ]);

      expect(actual[0]).toBe(`${tmpDir}/**/*.txt`);
      expect(actual[1]).toBe(`!${tmpDir}/nope.txt`);
    });
  });
  describe('main', () => {
    afterEach(async () => {
      await unwatchAll();
      cache.clearAll();
    });
    describe('with real files', () => {
      it('should fire when file is added', async () => {
        const pattern = `${tmpDir}/foo*`;
        const target = `${tmpDir}/foo_new`;
        const callback = vi.fn();
        await current(pattern, callback);

        await write('foo', target);

        await waitForWatchers();
        expect(callback).toHaveBeenCalledWith(path.resolve(target), 'created');
      });
      it('should fire when file is modified', async () => {
        const pattern = `${tmpDir}/foo*`;
        const target = `${tmpDir}/foo_modified`;
        const callback = vi.fn();
        await write('foo', target);
        await current(pattern, callback);

        await write('foo', target);

        await waitForWatchers();
        expect(callback).toHaveBeenCalledWith(path.resolve(target), 'modified');
      });
      it('should fire when file is deleted', async () => {
        const pattern = `${tmpDir}/foo*`;
        const target = `${tmpDir}/foo_delete`;
        const callback = vi.fn();
        await write('foo', target);
        await current(pattern, callback);

        await remove(target);

        await waitForWatchers();
        expect(callback).toHaveBeenCalledWith(path.resolve(target), 'removed');
      });
      it('should not fire for existing files at startup', async () => {
        const pattern = `${tmpDir}/foo*`;
        const callback = vi.fn();
        await current(pattern, callback);

        await waitForWatchers();
        expect(callback).not.toHaveBeenCalled();
      });
      it('should allow passing several patterns', async () => {
        const pattern = [`${tmpDir}/foo*`, `${tmpDir}/bar*`];
        const target = `${tmpDir}/bar_new`;
        const callback = vi.fn();
        await current(pattern, callback);

        await write('foo', target);

        await waitForWatchers();
        expect(callback).toHaveBeenCalledWith(path.resolve(target), 'created');
      });
      it('should mark callback as running when called', async () => {
        const pattern = `${tmpDir}/foo*`;
        const target = `${tmpDir}/foo_10`;
        vi.spyOn(cache, 'write');
        // Make a callback that takes some time to execute
        const callback = vi.fn().mockImplementation(async () => {
          await sleep(200);
        });
        // We need to define its own name so watcherCounter is not incremented in
        // cache and breaking the test
        const watcherName = `watcher_${new Date().getTime()}`;
        await current(pattern, callback, watcherName);

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
      it('should allow passing negating patterns', async () => {
        // Get all pug files, except the one in directories starting with _
        const pattern = [`${tmpDir}/**/*.pug`, `!${tmpDir}/_*/**/*.pug`];
        const target = `${tmpDir}/_includes/layouts/layout.pug`;
        await write('foo', target);

        const callback = vi.fn();
        await current(pattern, callback);

        await write('bar', target);
        await waitForWatchers();
        expect(callback).not.toHaveBeenCalledWith(
          path.resolve(target),
          'modified',
        );
      });
      describe('in new dir', () => {
        it('should fire for specific file created', async () => {
          const pattern = `${tmpDir}/foo/file.json`;
          const target = `${tmpDir}/foo/file.json`;
          const callback = vi.fn();
          await current(pattern, callback);

          await write('foo', target);

          await waitForWatchers();
          expect(callback).toHaveBeenCalledWith(
            path.resolve(target),
            'created',
          );
        });
        it('should fire for glob file created', async () => {
          const pattern = `${tmpDir}/foo/*.json`;
          const target = `${tmpDir}/foo/file.json`;
          const callback = vi.fn();
          await current(pattern, callback);

          await write('foo', target);

          await waitForWatchers();
          expect(callback).toHaveBeenCalledWith(
            path.resolve(target),
            'created',
          );
        });
        it('should fire for deep glob file created', async () => {
          const pattern = `${tmpDir}/foo/**/*.json`;
          const target = `${tmpDir}/foo/bar/baz/file.json`;
          const callback = vi.fn();
          await current(pattern, callback);

          await write('foo', target);

          await waitForWatchers();
          expect(callback).toHaveBeenCalledWith(
            path.resolve(target),
            'created',
          );
        });
        it('should fire for multiple patterns passed', async () => {
          const pattern = [
            `${tmpDir}/foo/file.json`,
            `${tmpDir}/bar/file.json`,
          ];
          const target = `${tmpDir}/bar/file.json`;
          const callback = vi.fn();
          await current(pattern, callback);

          await write('foo', target);

          await waitForWatchers();
          expect(callback).toHaveBeenCalledWith(
            path.resolve(target),
            'created',
          );
        });
      });
    });
    it('should store watcher name in the watcher', async () => {
      const actual = await current('pattern', vi.fn(), 'name');

      expect(actual).toHaveProperty('firostName', 'name');
    });
    it('should save the watcher name in cache', async () => {
      await current('pattern', vi.fn(), 'myWatcher');

      const actual = cache.read('watchers');

      expect(actual).toHaveProperty('myWatcher.name', 'myWatcher');
    });
    it('should save the watcher in cache', async () => {
      const watcher = await current('pattern', vi.fn());

      const actual = cache.read('watchers');

      expect(actual).toHaveProperty('watcher_1.watcher', watcher);
    });
    it('should save the watcher with specific name', async () => {
      const watcher = await current('pattern', vi.fn(), 'foo');

      const actual = cache.read('watchers');

      expect(actual).toHaveProperty('foo.watcher', watcher);
    });
  });
});
