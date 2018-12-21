import module from '../mkdirp';
import helper from '../test-helper';
import isDirectory from '../isDirectory';
import copy from '../copy';
const fixturePath = helper.fixturePath();
const tmpPath = helper.tmpPath('mkdirp');

describe('mkdirp', () => {
  beforeEach(async () => {
    await helper.clearTmpDirectory('mkdirp');
  });
  it('should create a directory', async () => {
    const destination = `${tmpPath}/foo`;
    await module(destination);

    const actual = await isDirectory(destination);
    expect(actual).toEqual(true);
  });
  it('should create nested directories', async () => {
    const destination = `${tmpPath}/foo/bar/baz`;
    await module(destination);

    const actual = await isDirectory(destination);
    expect(actual).toEqual(true);
  });
  it('should create nested directories even if part of the path already exist', async () => {
    await module(`${tmpPath}/foo/bar`);

    const destination = `${tmpPath}/foo/bar/baz`;
    await module(destination);
    const actual = await isDirectory(destination);
    expect(actual).toEqual(true);
  });
  it('should reject if part of the path is a file', async () => {
    // Create a file in the path
    await copy(`${fixturePath}/foo_1`, tmpPath);

    let actual;
    try {
      await module(`${tmpPath}/foo_1/bar`);
    } catch (error) {
      actual = error;
    }

    expect(actual).toHaveProperty('code', 'ENOTDIR');
  });
});
