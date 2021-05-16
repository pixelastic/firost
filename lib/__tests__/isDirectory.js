const current = require('../isDirectory');
const mkdirp = require('../mkdirp');
const write = require('../write');
const emptyDir = require('../emptyDir');
const symlink = require('../symlink');

describe('isDirectory', () => {
  const tmpDir = './tmp/isDirectory';
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  it('should return true if target is a directory', async () => {
    await mkdirp(`${tmpDir}/folder`);

    const actual = await current(`${tmpDir}/folder`);

    expect(actual).toEqual(true);
  });
  it('should return false if target is a file', async () => {
    await write('foo', `${tmpDir}/foo.txt`);

    const actual = await current(`${tmpDir}/foo.txt`);

    expect(actual).toEqual(false);
  });
  it('should return false if target does not exist', async () => {
    const actual = await current(`${tmpDir}/nope`);

    expect(actual).toEqual(false);
  });
  it('should return true if target is a symlink to a directory', async () => {
    const targetPath = `${tmpDir}/folder`;
    const linkPath = `${tmpDir}/link`;
    await mkdirp(targetPath);
    await symlink(linkPath, './folder');

    const actual = await current(linkPath);

    expect(actual).toEqual(true);
  });
});
