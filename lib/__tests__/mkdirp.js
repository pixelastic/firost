import { absolute } from '../absolute.js';
import { mkdirp } from '../mkdirp.js';
import { isDirectory } from '../isDirectory.js';
import { write } from '../write.js';
import { emptyDir } from '../emptyDir.js';
import { firostRoot } from '../test-helpers/firostRoot.js';

describe('mkdirp', () => {
  const tmpDir = absolute(firostRoot, '/tmp/mkdirp');
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  it('should create a directory', async () => {
    const destination = `${tmpDir}/foo`;
    await mkdirp(destination);

    const actual = await isDirectory(destination);
    expect(actual).toBe(true);
  });
  it('should create nested directories', async () => {
    const destination = `${tmpDir}/foo/bar/baz`;
    await mkdirp(destination);

    const actual = await isDirectory(destination);
    expect(actual).toBe(true);
  });
  it('should create nested directories even if part of the path already exist', async () => {
    await mkdirp(`${tmpDir}/foo/bar`);

    const destination = `${tmpDir}/foo/bar/baz`;
    await mkdirp(destination);
    const actual = await isDirectory(destination);
    expect(actual).toBe(true);
  });
  it('should reject if part of the path is a file', async () => {
    await write('foo', `${tmpDir}/foo_1`);

    let actual;
    try {
      await mkdirp(`${tmpDir}/foo_1/bar`);
    } catch (error) {
      actual = error;
    }

    expect(actual).toHaveProperty('code', 'ENOTDIR');
  });
  it('should understand <placeholders>', async () => {
    await mkdirp('<gitRoot>/tmp/mkdirp/nested/deep');

    const actual = await isDirectory(`${tmpDir}/nested/deep`);
    expect(actual).toBe(true);
  });
});
