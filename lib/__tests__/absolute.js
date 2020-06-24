const current = require('../absolute');
const emptyDir = require('../emptyDir');
const os = require('os');

describe('absolute', () => {
  const tmpDir = './tmp/absolute';
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  it('should keep the path absolute if already is', async () => {
    const input = '/absolute/path';
    const actual = current(input);
    expect(actual).toEqual(input);
  });
  it('should make a path absolute', async () => {
    const input = '/absolute/path/../path/with/relative/stuff/.';
    const actual = current(input);
    expect(actual).toEqual('/absolute/path/with/relative/stuff');
  });
  it('should handle ~/', async () => {
    const input = '~/somewhere';
    const actual = current(input);
    const expected = `${os.homedir()}/somewhere`;
    expect(actual).toEqual(expected);
  });
});
