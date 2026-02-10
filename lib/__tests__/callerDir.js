import { absolute } from '../absolute.js';
import { remove } from '../remove.js';
import { runInUserland } from '../test-helpers/runInUserland.js';
import { tmpDirectory } from '../tmpDirectory.js';
import { write } from '../write.js';

describe('callerDir', () => {
  const testDirectory = tmpDirectory(`firost/${describeName}`);
  afterEach(async () => {
    await remove(testDirectory);
  });

  it('should be able to return path to caller directory', async () => {
    // Create a helper that simply returns callerDir();
    await write(
      dedent`
        // External script that calls what is being passed
        export default function(method) {
          return method();
        }`,
      `${testDirectory}/helper/subdirectory/deep/helper.js`,
    );

    // Import the helper, call it and and output its callerdir
    const actual = await runInUserland(
      dedent`
        const { callerDir } = await __import('./callerDir.js');
        const { firostImport } = await __import('./firostImport.js');

        const helper = await firostImport('${testDirectory}/helper/subdirectory/deep/helper.js', { forcerReload: true });

        return helper(callerDir);
      `,
      absolute(testDirectory, 'lib/app.js'),
    );

    expect(actual).toEqual(`${testDirectory}/lib`);
  });
});
