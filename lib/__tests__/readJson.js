import module from '../readJson';
import helper from '../test-helper';
const fixturePath = helper.fixturePath();

describe('readJson', () => {
  it('should return the content of a file as a JSON object', async () => {
    const actual = await module(`${fixturePath}/settings.json`);

    expect(actual).toHaveProperty('foo', 'bar');
  });
  it('should reject if reading a non-existing file', async () => {
    let actual;
    try {
      await module(`${fixturePath}/nope.json`);
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
  it('should reject if not a JSON file', async () => {
    let actual;
    try {
      await module(`${fixturePath}/root.txt`);
    } catch (err) {
      actual = err;
    }
    expect(actual).toHaveProperty('code', 'ERROR_NOT_JSON');
  });
});
