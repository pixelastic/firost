import { absolute } from '../absolute.js';
import { isSymlink } from '../isSymlink.js';
import { write } from '../write.js';
import { mkdirp } from '../mkdirp.js';
import { remove } from '../remove.js';
import { emptyDir } from '../emptyDir.js';
import { symlink } from '../symlink.js';
import { firostRoot } from '../test-helpers/firostRoot.js';

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
});
