const current = require('../isFile');
const write = require('../write');
const mkdirp = require('../mkdirp');
const emptyDir = require('../emptyDir');
const symlink = require('../symlink');

describe('isFile', () => {
  const tmpDir = './tmp/isFile';
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  it('should return true if target is a file', async () => {
    await write('foo', `${tmpDir}/file.txt`);
    const actual = await current(`${tmpDir}/file.txt`);

    expect(actual).toEqual(true);
  });
  it('should return false if target is a directory', async () => {
    await mkdirp(`${tmpDir}/file`);
    const actual = await current(`${tmpDir}/file`);

    expect(actual).toEqual(false);
  });
  it('should return false if target does not exist', async () => {
    const actual = await current(`${tmpDir}/nope.nope`);

    expect(actual).toEqual(false);
  });
  it('should return true if target is a symlink to a file', async () => {
    const filePath = `${tmpDir}/foo.txt`;
    const linkPath = `${tmpDir}/link.txt`;
    await write('file content', filePath);
    await symlink(linkPath, './foo.txt');

    const actual = await current(linkPath);

    expect(actual).toEqual(true);
  });
});
