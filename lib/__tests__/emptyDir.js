import { absolute } from '../absolute.js';
import { emptyDir } from '../emptyDir.js';
import { exists } from '../exists.js';
import { mkdirp } from '../mkdirp.js';
import { newFile } from '../newFile/index.js';
import { remove } from '../remove.js';
import { runInUserland } from '../test-helpers/runInUserland.js';
import { tmpDirectory } from '../tmpDirectory.js';

describe('emptyDir', () => {
  const testDirectory = tmpDirectory('firost/emptyDir');
  afterEach(async () => {
    await remove(testDirectory);
  });
  it('should have removed all content of the directory', async () => {
    await newFile(`${testDirectory}/folder/foo.txt`);
    await newFile(`${testDirectory}/folder/bar.txt`);

    await emptyDir(`${testDirectory}/folder`);

    expect(await exists(`${testDirectory}/folder/foo.txt`)).toBe(false);
    expect(await exists(`${testDirectory}/folder/bar.txt`)).toBe(false);
  });
  it('should return true when done', async () => {
    await newFile(`${testDirectory}/folder/foo.txt`);

    const actual = await emptyDir(`${testDirectory}/folder`);

    expect(actual).toBe(true);
  });
  it('should return true even if folder was empty', async () => {
    await mkdirp(`${testDirectory}/folder`);

    const actual = await emptyDir(`${testDirectory}/folder`);

    expect(actual).toBe(true);
  });
  it('should return false if folder does not exist', async () => {
    const actual = await emptyDir(`${testDirectory}/folder`);

    expect(actual).toBe(false);
  });
  it('should return false if not a folder', async () => {
    await newFile(`${testDirectory}/foo.txt`);

    const actual = await emptyDir(`${testDirectory}/foo.txt`);

    expect(actual).toBe(false);
  });
  it('should throw an error if not a string', async () => {
    let actual = null;
    try {
      await emptyDir(function () {});
    } catch (err) {
      actual = err;
    }
    expect(actual).toHaveProperty(
      'code',
      'FIROST_EMPTY_DIR_TARGET_MUST_BE_STRING',
    );
  });
  it('with relative paths', async () => {
    await newFile(`${testDirectory}/lib/mydir/file.txt`);

    await runInUserland(
      dedent`
        const { emptyDir } = await __import('./emptyDir.js');
        return await emptyDir('./mydir');
      `,
      absolute(testDirectory, 'lib/app.js'),
    );

    const actual = await exists(`${testDirectory}/lib/mydir/file.txt`);
    expect(actual).toBe(false);
  });
});
