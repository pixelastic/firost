const module = require('../mkdirp');
const isDirectory = require('../isDirectory');
const write = require('../write');
const emptyDir = require('../emptyDir');

describe('mkdirp', () => {
  const tmpDir = './tmp/mkdirp';
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  it('should create a directory', async () => {
    const destination = `${tmpDir}/foo`;
    await module(destination);

    const actual = await isDirectory(destination);
    expect(actual).toEqual(true);
  });
  it('should create nested directories', async () => {
    const destination = `${tmpDir}/foo/bar/baz`;
    await module(destination);

    const actual = await isDirectory(destination);
    expect(actual).toEqual(true);
  });
  it('should create nested directories even if part of the path already exist', async () => {
    await module(`${tmpDir}/foo/bar`);

    const destination = `${tmpDir}/foo/bar/baz`;
    await module(destination);
    const actual = await isDirectory(destination);
    expect(actual).toEqual(true);
  });
  it('should reject if part of the path is a file', async () => {
    await write('foo', `${tmpDir}/foo_1`);

    let actual;
    try {
      await module(`${tmpDir}/foo_1/bar`);
    } catch (error) {
      actual = error;
    }

    expect(actual).toHaveProperty('code', 'ENOTDIR');
  });
});
