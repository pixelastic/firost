const current = require('../isSymlink');
const write = require('../write');
const mkdirp = require('../mkdirp');
const remove = require('../remove');
const emptyDir = require('../emptyDir');
const symlink = require('../symlink');

describe('isSymlink', () => {
  const tmpDir = './tmp/isSymlink';
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  it('should return true if input is a symlink to a file', async () => {
    const targetPath = `${tmpDir}/file.txt`;
    const linkPath = `${tmpDir}/link.txt`;

    await write('file content', targetPath);
    await symlink(linkPath, targetPath);

    const actual = await current(linkPath);

    expect(actual).toEqual(true);
  });
  it('should return true if input is a symlink to a directory', async () => {
    const targetPath = `${tmpDir}/subdir`;
    const linkPath = `${tmpDir}/link.txt`;

    await mkdirp(targetPath);
    await symlink(linkPath, targetPath);

    const actual = await current(linkPath);

    expect(actual).toEqual(true);
  });
  it('should return true if input is a broken symlink', async () => {
    const targetPath = `${tmpDir}/missing-file.txt`;
    const linkPath = `${tmpDir}/link.txt`;

    await write('file content', targetPath);
    await symlink(linkPath, targetPath);
    await remove(targetPath);

    const actual = await current(linkPath);

    expect(actual).toEqual(true);
  });
  it('should return false if input is a file', async () => {
    const targetPath = `${tmpDir}/file.txt`;

    await write('file content', targetPath);

    const actual = await current(targetPath);

    expect(actual).toEqual(false);
  });
  it('should return false if input is a directory', async () => {
    const targetPath = `${tmpDir}/subdir`;

    await mkdirp(targetPath);

    const actual = await current(targetPath);

    expect(actual).toEqual(false);
  });
  it('should return false if input does not exist', async () => {
    const targetPath = `${tmpDir}/missing-file.txt`;

    const actual = await current(targetPath);

    expect(actual).toEqual(false);
  });
});
