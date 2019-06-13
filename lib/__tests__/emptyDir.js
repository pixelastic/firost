import module from '../emptyDir';
import helper from '../test-helper';
import copy from '../copy';
import mkdirp from '../mkdirp';
import exists from '../exists';
const tmpPath = helper.tmpPath('emptyDir');
const fixturePath = helper.fixturePath();

describe('emptyDir', () => {
  beforeEach(async () => {
    await helper.clearTmpDirectory('emptyDir');
    await copy(`${fixturePath}/*`, tmpPath);
  });
  it('should have removed all content of the directory', async () => {
    await module(`${tmpPath}/first/second`);

    const actual = await exists(`${tmpPath}/first/second/second.txt`);
    expect(actual).toEqual(false);
  });
  it('should return true when done', async () => {
    const actual = await module(`${tmpPath}/first/second`);

    expect(actual).toEqual(true);
  });
  it('should return true even if folder was empty', async () => {
    await mkdirp(`${tmpPath}/foo`);
    const actual = await module(`${tmpPath}/foo`);

    expect(actual).toEqual(true);
  });
  it('should return false if folder does not exist', async () => {
    const actual = await module(`${tmpPath}/foo`);

    expect(actual).toEqual(false);
  });
  it('should return false if not a folder', async () => {
    const actual = await module(`${tmpPath}/root.gif`);

    expect(actual).toEqual(false);
  });
});
