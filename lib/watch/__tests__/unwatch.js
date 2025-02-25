import { waitForWatchers } from '../waitForWatchers.js';
import { unwatch } from '../unwatch.js';
import { watch } from '../index.js';
import { unwatchAll } from '../unwatchAll.js';
import { cache } from '../../cache.js';
import { absolute } from '../../absolute.js';
import { write } from '../../write.js';
import { emptyDir } from '../../emptyDir.js';
import firostRoot from '../../test-helpers/firostRoot.js';

describe('unwatch', () => {
  const tmpDir = absolute(firostRoot, '/tmp/watch/unwatch');
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
    await unwatch(watcher);
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
