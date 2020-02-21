const module = jestImport('../readJson');
const writeJson = jestImport('../writeJson');
const write = jestImport('../write');
const mkdirp = jestImport('../mkdirp');
const emptyDir = jestImport('../emptyDir');

describe('readJson', () => {
  const tmpDir = './tmp/readJson';
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  it('should return the content of a file as a JSON object', async () => {
    await writeJson({ foo: 'bar' }, `${tmpDir}/foo.json`);

    const actual = await module(`${tmpDir}/foo.json`);

    expect(actual).toHaveProperty('foo', 'bar');
  });
  it('should reject if reading a non-existing file', async () => {
    let actual;
    try {
      await module(`${tmpDir}/nope.json`);
    } catch (err) {
      actual = err;
    }
    expect(actual).toHaveProperty('code', 'ENOENT');
  });
  it('should reject if reading a directory', async () => {
    await mkdirp(`${tmpDir}/folder`);

    let actual;
    try {
      await module(`${tmpDir}/folder`);
    } catch (err) {
      actual = err;
    }
    expect(actual).toHaveProperty('code', 'EISDIR');
  });
  it('should reject if not a JSON file', async () => {
    await write('foo', `${tmpDir}/foo.txt`);

    let actual;
    try {
      await module(`${tmpDir}/foo.txt`);
    } catch (err) {
      actual = err;
    }
    expect(actual).toHaveProperty('code', 'ERROR_NOT_JSON');
  });
});
