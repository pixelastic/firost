import module from '../exists';
import helper from '../test-helper';
const fixturePath = helper.fixturePath();

describe('exists', () => {
  it('should return true if the target is a file', async () => {
    const actual = await module(`${fixturePath}/root.txt`);

    expect(actual).toEqual(true);
  });
  it('should return true if the target is a directory', async () => {
    const actual = await module(`${fixturePath}/first`);

    expect(actual).toEqual(true);
  });
  it('should return false if the target does not exist', async () => {
    const actual = await module(`${fixturePath}/nope`);

    expect(actual).toEqual(false);
  });
});
