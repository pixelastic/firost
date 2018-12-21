import module from '../isFile';
import helper from '../test-helper';
const fixturePath = helper.fixturePath();

describe('isFile', () => {
  it('should return true if target is a file', async () => {
    const actual = await module(`${fixturePath}/root.txt`);

    expect(actual).toEqual(true);
  });
  it('should return false if target is a directory', async () => {
    const actual = await module(`${fixturePath}/first`);

    expect(actual).toEqual(false);
  });
  it('should return false if target does not exist', async () => {
    const actual = await module(`${fixturePath}/nope.nope`);

    expect(actual).toEqual(false);
  });
});
