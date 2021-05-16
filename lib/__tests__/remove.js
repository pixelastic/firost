const current = require('../remove');
const exists = require('../exists');
const write = require('../write');
const mkdirp = require('../mkdirp');
const emptyDir = require('../emptyDir');
const symlink = require('../symlink');

describe('remove', () => {
  const tmpDir = './tmp/remove';
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  it('should stay silent if the file does not exist', async () => {
    let actual = 'unchanged';

    try {
      await current(`${tmpDir}/nope.nope`);
    } catch (error) {
      actual = error;
    }

    expect(actual).toEqual('unchanged');
  });
  it('should delete the target file', async () => {
    await write('foo', `${tmpDir}/foo.txt`);

    await current(`${tmpDir}/foo.txt`);

    expect(await exists(`${tmpDir}/foo.txt`)).toEqual(false);
  });
  it('should delete the target directory', async () => {
    await mkdirp(`${tmpDir}/folder`);

    await current(`${tmpDir}/folder`);

    expect(await exists(`${tmpDir}/folder`)).toEqual(false);
  });
  it('should delete all matching globs', async () => {
    await write('foo', `${tmpDir}/foo.txt`);
    await write('bar', `${tmpDir}/bar.txt`);
    await write('baz', `${tmpDir}/baz.txt`);

    await current(`${tmpDir}/b*.txt`);

    expect(await exists(`${tmpDir}/bar.txt`)).toEqual(false);
    expect(await exists(`${tmpDir}/baz.txt`)).toEqual(false);
  });
  it('should delete the symlink, not the file referenced by the symlink', async () => {
    const filePath = `${tmpDir}/foo.txt`;
    const linkPath = `${tmpDir}/link.txt`;
    await write('foo', filePath);
    await symlink(linkPath, filePath);

    await current(linkPath);

    expect(await exists(linkPath)).toEqual(false);
    expect(await exists(filePath)).toEqual(true);
  });
});
