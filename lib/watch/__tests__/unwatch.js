import { remove, tmpDirectory } from 'firost';
import { cache } from '../../cache.js';
import { write } from '../../write.js';
import { unwatch } from '../unwatch.js';
import { unwatchAll } from '../unwatchAll.js';
import { waitForWatchers } from '../waitForWatchers.js';
import { watch } from '../watch.js';

describe('unwatch', () => {
  const testDirectory = tmpDirectory('firost/watch/unwatch');
  afterEach(async () => {
    await unwatchAll();
    cache.clearAll();
    await remove(testDirectory);
  });
  it('should unwatch the given watcher', async () => {
    // Given
    const filepath = `${testDirectory}/myfile`;
    const callback = vi.fn();
    const watcher = await watch(filepath, callback);

    // When
    await unwatch(watcher);
    await write('something', filepath);

    // Then
    await waitForWatchers();
    expect(callback).not.toHaveBeenCalled();
  });
  it('should do nothing for unknown watcher', async () => {
    // Given
    const filepath = `${testDirectory}/myfile`;
    const callback = vi.fn();
    const watcher = await watch(filepath, callback);

    // When
    await unwatch(watcher);
    // Unwatching it again
    await unwatch(watcher);
    // Unwatching a non-existent watcher
    await unwatch('this-watcher-does-not-exist');

    // Then
    await write('something', filepath);
    await waitForWatchers();
    expect(callback).not.toHaveBeenCalled();
  });
});
