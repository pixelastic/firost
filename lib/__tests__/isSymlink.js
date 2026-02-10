import { absolute } from '../absolute.js';
import { isSymlink } from '../isSymlink.js';
import { mkdirp } from '../mkdirp.js';
import { remove } from '../remove.js';
import { symlink } from '../symlink.js';
import { runInUserland } from '../test-helpers/runInUserland.js';
import { tmpDirectory } from '../tmpDirectory.js';
import { write } from '../write.js';

describe('isSymlink', () => {
  const testDirectory = tmpDirectory('firost/isSymlink');
  afterEach(async () => {
    await remove(testDirectory);
  });
  it('should return true if input is a symlink to a file', async () => {
    const targetPath = `${testDirectory}/file.txt`;
    const linkPath = `${testDirectory}/link.txt`;

    await write('something', targetPath);
    await symlink(linkPath, targetPath);

    const actual = await isSymlink(linkPath);

    expect(actual).toBe(true);
  });
  it('should return true if input is a symlink to a directory', async () => {
    const targetPath = `${testDirectory}/subdir`;
    const linkPath = `${testDirectory}/link.txt`;

    await mkdirp(targetPath);
    await symlink(linkPath, targetPath);

    const actual = await isSymlink(linkPath);

    expect(actual).toBe(true);
  });
  it('should return true if input is a broken symlink', async () => {
    const targetPath = `${testDirectory}/missing-file.txt`;
    const linkPath = `${testDirectory}/link.txt`;

    await write('something', targetPath);
    await symlink(linkPath, targetPath);
    await remove(targetPath);

    const actual = await isSymlink(linkPath);

    expect(actual).toBe(true);
  });
  it('should return false if input is a file', async () => {
    const targetPath = `${testDirectory}/file.txt`;

    await write('something', targetPath);

    const actual = await isSymlink(targetPath);

    expect(actual).toBe(false);
  });
  it('should return false if input is a directory', async () => {
    const targetPath = `${testDirectory}/subdir`;

    await mkdirp(targetPath);

    const actual = await isSymlink(targetPath);

    expect(actual).toBe(false);
  });
  it('should return false if input does not exist', async () => {
    const targetPath = `${testDirectory}/missing-file.txt`;

    const actual = await isSymlink(targetPath);

    expect(actual).toBe(false);
  });
  it('with relative paths', async () => {
    await write('something', `${testDirectory}/lib/file.txt`);
    await symlink(`${testDirectory}/lib/link.txt`, './file.txt');

    const actual = await runInUserland(
      dedent`
        const { isSymlink } = await __import('./isSymlink.js');
        return await isSymlink('./link.txt');
      `,
      absolute(testDirectory, 'lib/app.js'),
    );

    expect(actual).toBe(true);
  });
});
