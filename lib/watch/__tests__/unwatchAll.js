import { remove, tmpDirectory } from 'firost';
import { cache } from '../../cache.js';
import { write } from '../../write.js';
import { unwatchAll } from '../unwatchAll.js';
import { waitForWatchers } from '../waitForWatchers.js';
import { watch } from '../watch.js';

describe('unwatchAll', () => {
  const testDirectory = tmpDirectory('firost/watch/unwatchAll');
  afterEach(async () => {
    await unwatchAll();
    cache.clearAll();
    await remove(testDirectory);
  });
  it('should unwatch all watchers', async () => {
    // Given
    const callback = vi.fn();
    await watch(`${testDirectory}/foo`, callback);
    await watch(`${testDirectory}/bar`, callback);

    // When
    await unwatchAll();
    await write('something', `${testDirectory}/foo`);
    await write('something', `${testDirectory}/bar`);

    // Then
    await waitForWatchers();
    expect(callback).not.toHaveBeenCalled();
  });
});
