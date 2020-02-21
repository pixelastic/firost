const module = require('../emptyDir');
const mkdirp = require('../mkdirp');
const exists = require('../exists');
const remove = require('../remove');
const write = require('../write');

describe('emptyDir', () => {
  const tmpDir = './tmp/emptyDir';
  beforeEach(async () => {
    if (await exists(tmpDir)) {
      await remove(tmpDir);
    }
    await mkdirp(tmpDir);
  });
  it('should have removed all content of the directory', async () => {
    await write('foo', `${tmpDir}/folder/foo.txt`);
    await write('bar', `${tmpDir}/folder/bar.txt`);

    await module(`${tmpDir}/folder`);

    expect(await exists(`${tmpDir}/folder/foo.txt`)).toEqual(false);
    expect(await exists(`${tmpDir}/folder/bar.txt`)).toEqual(false);
  });
  it('should return true when done', async () => {
    await write('foo', `${tmpDir}/folder/foo.txt`);

    const actual = await module(`${tmpDir}/folder`);

    expect(actual).toEqual(true);
  });
  it('should return true even if folder was empty', async () => {
    await mkdirp(`${tmpDir}/folder`);

    const actual = await module(`${tmpDir}/folder`);

    expect(actual).toEqual(true);
  });
  it('should return false if folder does not exist', async () => {
    const actual = await module(`${tmpDir}/folder`);

    expect(actual).toEqual(false);
  });
  it('should return false if not a folder', async () => {
    await write('foo', `${tmpDir}/foo.txt`);

    const actual = await module(`${tmpDir}/foo.txt`);

    expect(actual).toEqual(false);
  });
});
