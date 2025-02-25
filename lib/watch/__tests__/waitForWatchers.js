import { waitForWatchers } from '../waitForWatchers.js';
import { unwatchAll } from '../unwatchAll.js';
import { cache } from '../../cache.js';
import { absolute } from '../../absolute.js';
import { watch } from '../index.js';
import { write } from '../../write.js';
import { emptyDir } from '../../emptyDir.js';
import { firostRoot } from '../../test-helpers/firostRoot.js';

describe('waitForWatchers', () => {
  const tmpDir = absolute(firostRoot, '/tmp/watch/waitForWatchers');
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  afterEach(async () => {
    await unwatchAll();
    cache.clearAll();
  });
  it('should return quickly if no watchers activated', async () => {
    const before = new Date();
    await waitForWatchers();
    const after = new Date();

    expect(after - before).toBeLessThan(10);
  });
  describe('check for watched filepath at least one', () => {
    it('should not wait if not called', async () => {
      // This test is tricky.
      // When everything runs smoothly, the watcher is never called.
      // But when the machine is under load (for example when running the full
      // test suite), the watcher can sometimes be called.
      // So, to test that it should not be called, we check that the time
      // between the file creation and the watcher being called is high
      const filepath = `${tmpDir}/myfile`;

      let whenWatcherTriggered = null;
      await watch(filepath, () => {
        whenWatcherTriggered = new Date();
      });

      const whenFileCreated = new Date();
      await write('something', filepath);

      const actual = Math.abs(whenWatcherTriggered - whenFileCreated);
      expect(actual).toBeGreaterThan(50);
    });
    it('should wait if called', async () => {
      const filepath = `${tmpDir}/myfile`;
      let actual = 'before';
      await watch(filepath, () => {
        actual = 'after';
      });

      await write('something', filepath);

      await waitForWatchers();
      expect(actual).toEqual('after');
    });
  });
  describe('wait for callback to finish', () => {
    // Note: We do not have a test to ensure that watchers are not called if we
    // do not run waitForWatchers, as this is not true.
    // Watchers *can* be called if there is enough time (for example if
    // processing many different things). But waitForWatchers ensure they will
    // be called

    it('should wait if called', async () => {
      const filepath = `${tmpDir}/myfile`;
      let actual = 'before';
      await watch(filepath, async () => {
        actual = 'after';
      });

      await write('something', filepath);

      await waitForWatchers();
      expect(actual).toEqual('after');
    });
  });
});
