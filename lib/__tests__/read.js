import { absolute } from '../absolute.js';
import { read } from '../read.js';
import { write } from '../write.js';
import { emptyDir } from '../emptyDir.js';
import { mkdirp } from '../mkdirp.js';
import { remove } from '../remove.js';
import { firostRoot } from '../test-helpers/firostRoot.js';
import { tmpDirectory } from '../tmpDirectory.js';
import { runInUserland } from '../test-helpers/runInUserland.js';

describe('read', () => {
  const tmpDir = absolute(firostRoot, '/tmp/read');
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  describe('reading files', () => {
    it.each([['foo'], ['✓‽⛀']])('%s', async (input) => {
      await write(input, `${tmpDir}/input.txt`);

      const actual = await read(`${tmpDir}/input.txt`);

      expect(actual).toEqual(input);
    });
    it('with <placeholders>', async () => {
      // Given
      const userlandTmpDir = tmpDirectory('firost/read');
      await mkdirp(absolute(userlandTmpDir, '.git'));
      await write('something', absolute(userlandTmpDir, 'lib/src/file.txt'));

      // When
      const actual = await runInUserland(
        dedent`
          const { read } = await __import('./read.js');
          return await read('<gitRoot>/lib/src/file.txt');
        `,
        absolute(userlandTmpDir, 'lib/app.js'),
      );

      // Then
      expect(actual).toEqual('something');

      // Cleanup
      await remove(userlandTmpDir);
    });
  });
  describe('errors', () => {
    it.each([
      [`${tmpDir}/file/that/does/not/exist.txt`, 'ENOENT'],
      [tmpDir, 'EISDIR'],
    ])('%s', async (input, expected) => {
      let actual;
      try {
        await read(input);
      } catch (err) {
        actual = err;
      }
      expect(actual).toHaveProperty('code', expected);
    });
  });
});
