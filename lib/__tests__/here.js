import { absolute } from '../absolute.js';
import { remove } from '../remove.js';
import { runInUserland } from '../test-helpers/runInUserland.js';
import { tmpDirectory } from '../tmpDirectory.js';

describe('here', () => {
  const testDirectory = tmpDirectory(`firost/${describeName}`);
  afterEach(async () => {
    await remove(testDirectory);
  });

  it('should be able to return path to self', async () => {
    const actual = await runInUserland(
      dedent`
        const { here } = await __import('./here.js');
        const { read } = await __import('./read.js');

        // Magic comment: firost-magic-comment-here-test
        return await read(here());
      `,
      absolute(testDirectory, 'lib/app.js'),
    );

    expect(actual).toContain('firost-magic-comment-here-test');
  });
});
