const current = require('../readJson');
const writeJson = require('../writeJson');
const write = require('../write');
const mkdirp = require('../mkdirp');
const emptyDir = require('../emptyDir');

describe('readJson', () => {
  const tmpDir = './tmp/readJson';
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  it('should return the content of a file as a JSON object', async () => {
    await writeJson({ foo: 'bar' }, `${tmpDir}/foo.json`);

    const actual = await current(`${tmpDir}/foo.json`);

    expect(actual).toHaveProperty('foo', 'bar');
  });
  it('should reject if reading a non-existing file', async () => {
    let actual;
    try {
      await current(`${tmpDir}/nope.json`);
    } catch (err) {
      actual = err;
    }
    expect(actual).toHaveProperty('code', 'ENOENT');
  });
  it('should reject if reading a directory', async () => {
    await mkdirp(`${tmpDir}/folder`);

    let actual;
    try {
      await current(`${tmpDir}/folder`);
    } catch (err) {
      actual = err;
    }
    expect(actual).toHaveProperty('code', 'EISDIR');
  });
  it('should reject if not a JSON file', async () => {
    await write('foo', `${tmpDir}/foo.txt`);

    let actual;
    try {
      await current(`${tmpDir}/foo.txt`);
    } catch (err) {
      actual = err;
    }
    expect(actual).toHaveProperty('code', 'ERROR_NOT_JSON');
  });
});
