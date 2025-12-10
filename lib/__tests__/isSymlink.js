import { absolute } from '../absolute.js';
import { isSymlink } from '../isSymlink.js';
import { write } from '../write.js';
import { mkdirp } from '../mkdirp.js';
import { remove } from '../remove.js';
import { emptyDir } from '../emptyDir.js';
import { symlink } from '../symlink.js';
import { firostRoot } from '../test-helpers/firostRoot.js';
import { tmpDirectory } from '../tmpDirectory.js';
import { newFile } from '../newFile/index.js';
import { runInUserland } from '../test-helpers/runInUserland.js';

describe('isSymlink', () => {
  const tmpDir = absolute(firostRoot, '/tmp/isSymlink');
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  it('should return true if input is a symlink to a file', async () => {
    const targetPath = `${tmpDir}/file.txt`;
    const linkPath = `${tmpDir}/link.txt`;

    await write('file content', targetPath);
    await symlink(linkPath, targetPath);

    const actual = await isSymlink(linkPath);

    expect(actual).toBe(true);
  });
  it('should return true if input is a symlink to a directory', async () => {
    const targetPath = `${tmpDir}/subdir`;
    const linkPath = `${tmpDir}/link.txt`;

    await mkdirp(targetPath);
    await symlink(linkPath, targetPath);

    const actual = await isSymlink(linkPath);

    expect(actual).toBe(true);
  });
  it('should return true if input is a broken symlink', async () => {
    const targetPath = `${tmpDir}/missing-file.txt`;
    const linkPath = `${tmpDir}/link.txt`;

    await write('file content', targetPath);
    await symlink(linkPath, targetPath);
    await remove(targetPath);

    const actual = await isSymlink(linkPath);

    expect(actual).toBe(true);
  });
  it('should return false if input is a file', async () => {
    const targetPath = `${tmpDir}/file.txt`;

    await write('file content', targetPath);

    const actual = await isSymlink(targetPath);

    expect(actual).toBe(false);
  });
  it('should return false if input is a directory', async () => {
    const targetPath = `${tmpDir}/subdir`;

    await mkdirp(targetPath);

    const actual = await isSymlink(targetPath);

    expect(actual).toBe(false);
  });
  it('should return false if input does not exist', async () => {
    const targetPath = `${tmpDir}/missing-file.txt`;

    const actual = await isSymlink(targetPath);

    expect(actual).toBe(false);
  });
  it('with <placeholders>', async () => {
    // Given
    const userlandTmpDir = tmpDirectory('firost/isSymlink');
    await mkdirp(absolute(userlandTmpDir, '.git'));
    await newFile(absolute(userlandTmpDir, 'lib/src/file.txt'));
    await symlink(
      absolute(userlandTmpDir, 'link.txt'),
      absolute(userlandTmpDir, 'lib/src/file.txt'),
    );

    // When
    const actual = await runInUserland(
      dedent`
          const { isSymlink } = await __import('./isSymlink.js');
          const one = await isSymlink('<gitRoot>/link.txt');
          const two = await isSymlink('<gitRoot>/lib/src/file.txt');
          const three = await isSymlink('<gitRoot>/lib');
          const four = await isSymlink('<gitRoot>/lib/nope.txt');
          return { one, two, three, four }
        `,
      absolute(userlandTmpDir, 'lib/app.js'),
    );

    // Then
    expect(actual).toEqual({
      one: true,
      two: false,
      three: false,
      four: false,
    });

    // Cleanup
    await remove(userlandTmpDir);
  });
});
