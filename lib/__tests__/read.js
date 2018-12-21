import module from '../read';
import helper from '../test-helper';
const fixturePath = helper.fixturePath();

describe('read', () => {
  it('should return the content of a file', async () => {
    const actual = await module(`${fixturePath}/foo_100`);

    expect(actual).toEqual('foo_100');
  });
  it('should return utf8 content', async () => {
    const actual = await module(`${fixturePath}/utf8`);

    expect(actual).toEqual('‽✗✓');
  });
  it('should reject if reading a non-existing file', async () => {
    let actual;
    try {
      await module(`${fixturePath}/nope.nope`);
    } catch (err) {
      actual = err;
    }
    expect(actual).toHaveProperty('code', 'ENOENT');
  });
  it('should reject if reading a directory', async () => {
    let actual;
    try {
      await module(`${fixturePath}/first`);
    } catch (err) {
      actual = err;
    }
    expect(actual).toHaveProperty('code', 'EISDIR');
  });
});
