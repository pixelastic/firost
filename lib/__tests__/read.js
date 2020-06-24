const current = require('../read');
const write = require('../write');
const mkdirp = require('../mkdirp');
const emptyDir = require('../emptyDir');

describe('read', () => {
  const tmpDir = './tmp/read';
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  it('should return the content of a file', async () => {
    await write('foo', `${tmpDir}/foo.txt`);

    const actual = await current(`${tmpDir}/foo.txt`);

    expect(actual).toEqual('foo');
  });
  it('should return utf8 content', async () => {
    await write('✓‽⛀', `${tmpDir}/foo.txt`);

    const actual = await current(`${tmpDir}/foo.txt`);

    expect(actual).toEqual('✓‽⛀');
  });
  it('should reject if reading a non-existing file', async () => {
    let actual;
    try {
      await current(`${tmpDir}/foo.txt`);
    } catch (err) {
      actual = err;
    }
    expect(actual).toHaveProperty('code', 'ENOENT');
  });
  it('should reject if reading a directory', async () => {
    await mkdirp(`${tmpDir}/folder`);

    let actual;
    try {
      await current(`${tmpDir}/folder`);
    } catch (err) {
      actual = err;
    }
    expect(actual).toHaveProperty('code', 'EISDIR');
  });
});
