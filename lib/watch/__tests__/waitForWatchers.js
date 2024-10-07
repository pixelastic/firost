import current from '../waitForWatchers.js';
import unwatchAll from '../unwatchAll.js';
import cache from '../../cache.js';
import sleep from '../../sleep.js';
import absolute from '../../absolute.js';
import watch from '../index.js';
import write from '../../write.js';
import emptyDir from '../../emptyDir.js';

describe('waitForWatchers', () => {
  const tmpDir = absolute('<gitRoot>/tmp/watch/waitForWatchers');
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  afterEach(async () => {
    await unwatchAll();
    cache.clearAll();
  });
  it('should return quickly if no watchers activated', async () => {
    const before = new Date();
    await current();
    const after = new Date();

    expect(after - before).toBeLessThan(10);
  });
  describe('check for watched filepath at least one', () => {
    it('should not wait if not called', async () => {
      const filepath = `${tmpDir}/myfile`;
      let actual = 'before';
      await watch(filepath, () => {
        actual = 'after';
      });

      await write('something', filepath);

      expect(actual).toEqual('before');
    });
    it('should wait if called', async () => {
      const filepath = `${tmpDir}/myfile`;
      let actual = 'before';
      await watch(filepath, () => {
        actual = 'after';
      });

      await write('something', filepath);

      await current();
      expect(actual).toEqual('after');
    });
  });
  describe('wait for callback to finish', () => {
    it('should not wait if not called', async () => {
      const filepath = `${tmpDir}/myfile`;
      let actual = 'before';
      await watch(filepath, async () => {
        await sleep(200);
        actual = 'after';
      });

      await write('something', filepath);

      expect(actual).toEqual('before');
    });
    it('should wait if called', async () => {
      const filepath = `${tmpDir}/myfile`;
      let actual = 'before';
      await watch(filepath, async () => {
        await sleep(200);
        actual = 'after';
      });

      await write('something', filepath);

      await current();
      expect(actual).toEqual('after');
    });
  });
});
