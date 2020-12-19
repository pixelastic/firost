const current = require('../exists');
const mkdirp = require('../mkdirp');
const write = require('../write');
const emptyDir = require('../emptyDir');

describe('exists', () => {
  const tmpDir = './tmp/exists';
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  it('should return true if the target is a file', async () => {
    await write('foo', `${tmpDir}/foo.txt`);

    const actual = await current(`${tmpDir}/foo.txt`);

    expect(actual).toEqual(true);
  });
  it('should return true if the target is a directory', async () => {
    await mkdirp(`${tmpDir}/folder`);

    const actual = await current(`${tmpDir}/folder`);

    expect(actual).toEqual(true);
  });
  it('should return false if the target does not exist', async () => {
    const actual = await current(`${tmpDir}/nope`);

    expect(actual).toEqual(false);
  });
  describe('empty files', () => {
    it('should return true by default', async () => {
      await write('', `${tmpDir}/empty.txt`);

      const actual = await current(`${tmpDir}/empty.txt`);

      expect(actual).toEqual(true);
    });
    it('should return false with ignoreEmptyFiles: true', async () => {
      await write('', `${tmpDir}/empty.txt`);

      const actual = await current(`${tmpDir}/empty.txt`, {
        ignoreEmptyFiles: true,
      });

      expect(actual).toEqual(false);
    });
  });
});
