import { absolute } from '../absolute.js';
import { read } from '../read.js';
import { write } from '../write.js';
import { emptyDir } from '../emptyDir.js';
import { mkdirp } from '../mkdirp.js';
import { remove } from '../remove.js';
import { firostRoot } from '../test-helpers/firostRoot.js';
import { tmpDirectory } from '../tmpDirectory.js';
import { runInUserland } from '../test-helpers/runInUserland.js';
import { exists } from '../exists.js';

describe('write', () => {
  const tmpDir = absolute(firostRoot, '/tmp/write');
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  it('should create a file with the given content', async () => {
    await write('content', `${tmpDir}/file.txt`);

    expect(await read(`${tmpDir}/file.txt`)).toBe('content');
  });
  it('should overwrite an existing file', async () => {
    await write('initial content', `${tmpDir}/file.txt`);
    await write('updated content', `${tmpDir}/file.txt`);

    expect(await read(`${tmpDir}/file.txt`)).toBe('updated content');
  });
  it('should create nested directories', async () => {
    await write('content', `${tmpDir}/nested/sub/directories/file.txt`);

    expect(await read(`${tmpDir}/nested/sub/directories/file.txt`)).toBe(
      'content',
    );
  });
  it('should do nothing if given undefined as content', async () => {
    await write(undefined, `${tmpDir}/file.txt`);

    expect(await exists(`${tmpDir}/file.txt`)).toBe(false);
  });
  it('should warn if ENAMETOOLONG (probably swapped args)', async () => {
    const dummyContent = 'a'.repeat(5000);

    let actual = null;
    try {
      await write(`${tmpDir}/file.txt`, dummyContent);
    } catch (error) {
      actual = error;
    }

    expect(actual).toHaveProperty('code', 'ERROR_SWAPPED_ARGUMENTS');
  });
  it('with <placeholders>', async () => {
    // Given
    const userlandTmpDir = tmpDirectory('firost/write');
    await mkdirp(absolute(userlandTmpDir, '.git'));

    // When
    await runInUserland(
      dedent`
          const { write } = await __import('./write.js');
          return await write('Something', '<gitRoot>/lib/src/file.txt');
        `,
      absolute(userlandTmpDir, 'lib/app.js'),
    );

    // Then
    const actual = await read(absolute(userlandTmpDir, 'lib/src/file.txt'));
    expect(actual).toEqual('Something');

    // Cleanup
    await remove(userlandTmpDir);
  });
});
