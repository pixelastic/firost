import module from '../remove';
import helper from '../test-helper';
import copy from '../copy';
import exists from '../exists';
const tmpPath = helper.tmpPath('remove');
const fixturePath = helper.fixturePath();

describe('remove', () => {
  beforeEach(async () => {
    await helper.clearTmpDirectory('remove');
    await copy(`${fixturePath}/*`, tmpPath);
  });
  it('should stay silent if the file does not exist', async () => {
    let actual = 'foo';

    try {
      await module(`${tmpPath}/nope.nope`);
    } catch (error) {
      actual = error;
    }

    expect(actual).toEqual('foo');
  });
  it('should delete the target file', async () => {
    const target = `${tmpPath}/root.txt`;
    await module(target);

    const actual = await exists(target);
    expect(actual).toEqual(false);
  });
  it('should delete the target directory', async () => {
    const target = `${tmpPath}/first`;
    await module(target);

    const actual = await exists(target);
    expect(actual).toEqual(false);
  });
  it('should delete all matching globs', async () => {
    const target = `${tmpPath}/root.*`;
    await module(target);

    await exists(target);
    expect(await exists(`${tmpPath}/root.txt`)).toEqual(false);
    expect(await exists(`${tmpPath}/root.gif`)).toEqual(false);
  });
});
