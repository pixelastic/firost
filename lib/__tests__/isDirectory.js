const module = require('../isDirectory');
const mkdirp = require('../mkdirp');
const write = require('../write');
const emptyDir = require('../emptyDir');

describe('isDirectory', () => {
  const tmpDir = './tmp/isDirectory';
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  it('should return true if target is a directory', async () => {
    await mkdirp(`${tmpDir}/folder`);

    const actual = await module(`${tmpDir}/folder`);

    expect(actual).toEqual(true);
  });
  it('should return false if target is a file', async () => {
    await write('foo', `${tmpDir}/foo.txt`);

    const actual = await module(`${tmpDir}/foo.txt`);

    expect(actual).toEqual(false);
  });
  it('should return false if target does not exist', async () => {
    const actual = await module(`${tmpDir}/nope`);

    expect(actual).toEqual(false);
  });
});
