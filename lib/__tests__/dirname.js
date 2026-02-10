import { absolute } from '../absolute.js';
import { remove } from '../remove.js';
import { runInUserland } from '../test-helpers/runInUserland.js';
import { tmpDirectory } from '../tmpDirectory.js';

describe('dirname', () => {
  const testDirectory = tmpDirectory(`firost/${describeName}`);
  afterEach(async () => {
    await remove(testDirectory);
  });

  describe('with no argument', () => {
    it('should return directory of this test', async () => {
      const actual = await runInUserland(
        dedent`
        const { dirname } = await __import('./dirname.js');

        return await dirname();
      `,
        absolute(testDirectory, 'lib/app.js'),
      );

      expect(actual).toEqual(`${testDirectory}/lib`);
    });
  });

  describe('with an argument', () => {
    it('should act as path.dirname', async () => {
      const actual = await runInUserland(
        dedent`
        const { dirname } = await __import('./dirname.js');

        return await dirname('/path/to/a/file.txt');
      `,
        absolute(testDirectory, 'lib/app.js'),
      );

      expect(actual).toEqual('/path/to/a');
    });
  });
});
