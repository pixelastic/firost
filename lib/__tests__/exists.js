import { absolute } from '../absolute.js';
import { emptyDir } from '../emptyDir.js';
import { exists } from '../exists.js';
import { firostRoot } from '../test-helpers/firostRoot.js';
import { mkdirp } from '../mkdirp.js';
import { newFile } from '../newFile/index.js';
import { remove } from '../remove.js';
import { runInUserland } from '../test-helpers/runInUserland.js';
import { tmpDirectory } from '../tmpDirectory.js';
import { write } from '../write.js';

describe('exists', () => {
  const tmpDir = absolute(firostRoot, '/tmp/exists');
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  it('should return true if the target is a file', async () => {
    await write('foo', `${tmpDir}/foo.txt`);

    const actual = await exists(`${tmpDir}/foo.txt`);

    expect(actual).toBe(true);
  });
  it('should return true if the target is a directory', async () => {
    await mkdirp(`${tmpDir}/folder`);

    const actual = await exists(`${tmpDir}/folder`);

    expect(actual).toBe(true);
  });
  it('should return false if the target does not exist', async () => {
    const actual = await exists(`${tmpDir}/nope`);

    expect(actual).toBe(false);
  });
  it('with <placeholders>', async () => {
    // Given
    const userlandTmpDir = tmpDirectory('firost/exists');
    await mkdirp(absolute(userlandTmpDir, '.git'));
    await newFile(absolute(userlandTmpDir, 'lib/src/file.txt'));

    // When
    const actual = await runInUserland(
      dedent`
          const { exists } = await __import('./exists.js');
          const yes = await exists('<gitRoot>/lib/src/file.txt');
          const no = await exists('<gitRoot>/lib/src/nope.txt');
          return { yes, no }
        `,
      absolute(userlandTmpDir, 'lib/app.js'),
    );

    // Then
    expect(actual).toEqual({
      yes: true,
      no: false,
    });

    // Cleanup
    await remove(userlandTmpDir);
  });
  describe('empty files', () => {
    it('should return true by default', async () => {
      await write('', `${tmpDir}/empty.txt`);

      const actual = await exists(`${tmpDir}/empty.txt`);

      expect(actual).toBe(true);
    });
    it('should return false with ignoreEmptyFiles: true', async () => {
      await write('', `${tmpDir}/empty.txt`);

      const actual = await exists(`${tmpDir}/empty.txt`, {
        ignoreEmptyFiles: true,
      });

      expect(actual).toBe(false);
    });
  });
});
