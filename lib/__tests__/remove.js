import { absolute } from '../absolute.js';
import { remove } from '../remove.js';
import { newFile } from '../newFile/index.js';
import { exists } from '../exists.js';
import { write } from '../write.js';
import { mkdirp } from '../mkdirp.js';
import { emptyDir } from '../emptyDir.js';
import { symlink } from '../symlink.js';
import { isFile } from '../isFile.js';
import { tmpDirectory } from '../tmpDirectory.js';
import { glob } from '../glob.js';
import { firostRoot } from '../test-helpers/firostRoot.js';
import { runInUserland } from '../test-helpers/runInUserland.js';

describe('remove', () => {
  const tmpDir = absolute(firostRoot, '/tmp/remove');
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  it('should stay silent if the file does not exist', async () => {
    let actual = 'unchanged';

    try {
      await remove(`${tmpDir}/nope.nope`);
    } catch (error) {
      actual = error;
    }

    expect(actual).toBe('unchanged');
  });
  it('should delete the target file', async () => {
    await write('foo', `${tmpDir}/foo.txt`);

    await remove(`${tmpDir}/foo.txt`);

    expect(await exists(`${tmpDir}/foo.txt`)).toBe(false);
  });
  it('should delete the target directory', async () => {
    await mkdirp(`${tmpDir}/folder`);

    await remove(`${tmpDir}/folder`);

    expect(await exists(`${tmpDir}/folder`)).toBe(false);
  });
  it('should accept an array of filepaths', async () => {
    await newFile(`${tmpDir}/file1.txt`);
    await newFile(`${tmpDir}/file2.jpg`);
    await newFile(`${tmpDir}/file3.png`);

    await remove([`${tmpDir}/file1.txt`, `${tmpDir}/file2.jpg`]);

    const remainingFiles = await glob('*', { cwd: tmpDir });
    expect(remainingFiles).toEqual([`${tmpDir}/file3.png`]);
  });
  it('should delete all matching globs', async () => {
    await write('foo', `${tmpDir}/foo.txt`);
    await write('bar', `${tmpDir}/bar.txt`);
    await write('baz', `${tmpDir}/baz.txt`);

    await remove(`${tmpDir}/b*.txt`);

    expect(await exists(`${tmpDir}/bar.txt`)).toBe(false);
    expect(await exists(`${tmpDir}/baz.txt`)).toBe(false);
  });
  it('should delete the symlink, not the file referenced by the symlink', async () => {
    const filePath = `${tmpDir}/foo.txt`;
    const linkPath = `${tmpDir}/link.txt`;
    await write('foo', filePath);
    await symlink(linkPath, filePath);

    await remove(linkPath);

    expect(await exists(linkPath)).toBe(false);
    expect(await exists(filePath)).toBe(true);
  });
  it('with <placeholders>', async () => {
    // Given
    const userlandTmpDir = tmpDirectory('firost/remove');
    await mkdirp(absolute(userlandTmpDir, '.git'));
    await newFile(absolute(userlandTmpDir, 'lib/src/file.txt'));

    // When
    await runInUserland(
      dedent`
          const { remove } = await __import('./remove.js');
          return await remove('<gitRoot>/lib/src/file.txt');
        `,
      absolute(userlandTmpDir, 'lib/app.js'),
    );

    // Then
    const actual = await isFile(absolute(userlandTmpDir, 'lib/src/file.txt'));
    expect(actual).toEqual(false);

    // Cleanup
    await remove(userlandTmpDir);
  });
  it('with relative paths', async () => {
    // Given
    const userlandTmpDir = tmpDirectory('firost/remove');
    await newFile(absolute(userlandTmpDir, 'lib/file.txt'));

    // When
    await runInUserland(
      dedent`
          const { remove } = await __import('./remove.js');
          return await remove('./file.txt');
        `,
      absolute(userlandTmpDir, 'lib/app.js'),
    );

    // Then
    const actual = await isFile(absolute(userlandTmpDir, 'lib/file.txt'));
    expect(actual).toEqual(false);

    // Cleanup
    await remove(userlandTmpDir);
  });
});
