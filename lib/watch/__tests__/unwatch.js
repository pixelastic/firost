import waitForWatchers from '../waitForWatchers.js';
import current from '../unwatch.js';
import watch from '../index.js';
import unwatchAll from '../unwatchAll.js';
import cache from '../../cache.js';
import absolute from '../../absolute.js';
import write from '../../write.js';
import emptyDir from '../../emptyDir.js';

describe('unwatch', () => {
  const tmpDir = absolute('<gitRoot>/tmp/watch/unwatch');
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  afterEach(async () => {
    await unwatchAll();
    cache.clearAll();
  });
  it('should unwatch the given watcher', async () => {
    // Given
    const filepath = `${tmpDir}/myfile`;
    const callback = vi.fn();
    const watcher = await watch(filepath, callback);

    // When
    await current(watcher);
    await write('something', filepath);

    // Then
    await waitForWatchers();
    expect(callback).not.toHaveBeenCalled();
  });
  it('should do nothing for unknown watcher', async () => {
    // Given
    const filepath = `${tmpDir}/myfile`;
    const callback = vi.fn();
    const watcher = await watch(filepath, callback);

    // When
    await current(watcher);
    // Unwatching it again
    await current(watcher);
    // Unwatching a non-existent watcher
    await current('this-watcher-does-not-exist');

    // Then
    await write('something', filepath);
    await waitForWatchers();
    expect(callback).not.toHaveBeenCalled();
  });
});
