import absolute from '../absolute.js';
import current from '../mkdirp.js';
import isDirectory from '../isDirectory.js';
import write from '../write.js';
import emptyDir from '../emptyDir.js';

describe('mkdirp', () => {
  const tmpDir = absolute('<gitRoot>/tmp/mkdirp');
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  it('should create a directory', async () => {
    const destination = `${tmpDir}/foo`;
    await current(destination);

    const actual = await isDirectory(destination);
    expect(actual).toBe(true);
  });
  it('should create nested directories', async () => {
    const destination = `${tmpDir}/foo/bar/baz`;
    await current(destination);

    const actual = await isDirectory(destination);
    expect(actual).toBe(true);
  });
  it('should create nested directories even if part of the path already exist', async () => {
    await current(`${tmpDir}/foo/bar`);

    const destination = `${tmpDir}/foo/bar/baz`;
    await current(destination);
    const actual = await isDirectory(destination);
    expect(actual).toBe(true);
  });
  it('should reject if part of the path is a file', async () => {
    await write('foo', `${tmpDir}/foo_1`);

    let actual;
    try {
      await current(`${tmpDir}/foo_1/bar`);
    } catch (error) {
      actual = error;
    }

    expect(actual).toHaveProperty('code', 'ENOTDIR');
  });
});
