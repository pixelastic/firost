import { absolute } from '../absolute.js';
import { emptyDir } from '../emptyDir.js';
import { isDirectory } from '../isDirectory.js';
import { mkdirp } from '../mkdirp.js';
import { remove } from '../remove.js';
import { firostRoot } from '../test-helpers/firostRoot.js';
import { runInUserland } from '../test-helpers/runInUserland.js';
import { tmpDirectory } from '../tmpDirectory.js';
import { write } from '../write.js';

describe('mkdirp', () => {
  const tmpDir = absolute(firostRoot, '/tmp/mkdirp');
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  it('should create a directory', async () => {
    const destination = `${tmpDir}/foo`;
    await mkdirp(destination);

    const actual = await isDirectory(destination);
    expect(actual).toBe(true);
  });
  it('should create nested directories', async () => {
    const destination = `${tmpDir}/foo/bar/baz`;
    await mkdirp(destination);

    const actual = await isDirectory(destination);
    expect(actual).toBe(true);
  });
  it('should create nested directories even if part of the path already exist', async () => {
    await mkdirp(`${tmpDir}/foo/bar`);

    const destination = `${tmpDir}/foo/bar/baz`;
    await mkdirp(destination);
    const actual = await isDirectory(destination);
    expect(actual).toBe(true);
  });
  it('should reject if part of the path is a file', async () => {
    await write('foo', `${tmpDir}/foo_1`);

    let actual;
    try {
      await mkdirp(`${tmpDir}/foo_1/bar`);
    } catch (error) {
      actual = error;
    }

    expect(actual).toHaveProperty('code', 'ENOTDIR');
  });
  it('with <placeholders>', async () => {
    // Given
    const userlandTmpDir = tmpDirectory('firost/mkdirp');
    await mkdirp(absolute(userlandTmpDir, '.git'));

    // When
    await runInUserland(
      dedent`
          const { mkdirp } = await __import('./mkdirp.js');
          return await mkdirp('<gitRoot>/lib/src');
        `,
      absolute(userlandTmpDir, 'lib/app.js'),
    );

    // Then
    const actual = await isDirectory(absolute(userlandTmpDir, 'lib'));
    expect(actual).toEqual(true);

    // Cleanup
    await remove(userlandTmpDir);
  });
});
