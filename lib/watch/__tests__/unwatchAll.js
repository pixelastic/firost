import { absolute } from '../../absolute.js';
import { cache } from '../../cache.js';
import { emptyDir } from '../../emptyDir.js';
import { unwatchAll } from '../unwatchAll.js';
import { waitForWatchers } from '../waitForWatchers.js';
import { watch } from '../watch.js';
import { write } from '../../write.js';
import { firostRoot } from '../../test-helpers/firostRoot.js';

describe('unwatchAll', () => {
  const tmpDir = absolute(firostRoot, '/tmp/watch/unwatchAll');
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  afterEach(async () => {
    await unwatchAll();
    cache.clearAll();
  });
  it('should unwatch all watchers', async () => {
    // Given
    const callback = vi.fn();
    await watch(`${tmpDir}/foo`, callback);
    await watch(`${tmpDir}/bar`, callback);

    // When
    await unwatchAll();
    await write('something', `${tmpDir}/foo`);
    await write('something', `${tmpDir}/bar`);

    // Then
    await waitForWatchers();
    expect(callback).not.toHaveBeenCalled();
  });
});
