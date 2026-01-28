import { absolute } from '../absolute.js';
import { emptyDir } from '../emptyDir.js';
import { exists } from '../exists.js';
import { mkdirp } from '../mkdirp.js';
import { newFile } from '../newFile/index.js';
import { remove } from '../remove.js';
import { firostRoot } from '../test-helpers/firostRoot.js';
import { runInUserland } from '../test-helpers/runInUserland.js';
import { tmpDirectory } from '../tmpDirectory.js';
import { write } from '../write.js';

describe('emptyDir', () => {
  const tmpDir = absolute(firostRoot, '/tmp/emptyDir');
  beforeEach(async () => {
    if (await exists(tmpDir)) {
      await remove(tmpDir);
    }
    await mkdirp(tmpDir);
  });
  it('should have removed all content of the directory', async () => {
    await write('foo', `${tmpDir}/folder/foo.txt`);
    await write('bar', `${tmpDir}/folder/bar.txt`);

    await emptyDir(`${tmpDir}/folder`);

    expect(await exists(`${tmpDir}/folder/foo.txt`)).toBe(false);
    expect(await exists(`${tmpDir}/folder/bar.txt`)).toBe(false);
  });
  it('should return true when done', async () => {
    await write('foo', `${tmpDir}/folder/foo.txt`);

    const actual = await emptyDir(`${tmpDir}/folder`);

    expect(actual).toBe(true);
  });
  it('should return true even if folder was empty', async () => {
    await mkdirp(`${tmpDir}/folder`);

    const actual = await emptyDir(`${tmpDir}/folder`);

    expect(actual).toBe(true);
  });
  it('should return false if folder does not exist', async () => {
    const actual = await emptyDir(`${tmpDir}/folder`);

    expect(actual).toBe(false);
  });
  it('should return false if not a folder', async () => {
    await write('foo', `${tmpDir}/foo.txt`);

    const actual = await emptyDir(`${tmpDir}/foo.txt`);

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
  it('with <placeholders>', async () => {
    // Given
    const userlandTmpDir = tmpDirectory('firost/emptyDir');
    await mkdirp(absolute(userlandTmpDir, '.git'));
    await newFile(absolute(userlandTmpDir, 'lib/src/file.txt'));
    await newFile(absolute(userlandTmpDir, 'lib/src/file.json'));

    // When
    await runInUserland(
      dedent`
          const { emptyDir } = await __import('./emptyDir.js');
          return await emptyDir('<gitRoot>/lib');
        `,
      absolute(userlandTmpDir, 'lib/app.js'),
    );

    // Then
    expect(await exists(`${userlandTmpDir}/lib/src/file.txt`)).toBe(false);
    expect(await exists(`${userlandTmpDir}/lib/src/file.json`)).toBe(false);

    // Cleanup
    await remove(userlandTmpDir);
  });
});
