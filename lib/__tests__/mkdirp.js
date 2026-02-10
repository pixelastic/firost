import { absolute } from '../absolute.js';
import { isDirectory } from '../isDirectory.js';
import { mkdirp } from '../mkdirp.js';
import { remove } from '../remove.js';
import { runInUserland } from '../test-helpers/runInUserland.js';
import { tmpDirectory } from '../tmpDirectory.js';
import { write } from '../write.js';

describe('mkdirp', () => {
  const testDirectory = tmpDirectory('firost/mkdirp');
  afterEach(async () => {
    await remove(testDirectory);
  });
  it('should create a directory', async () => {
    const destination = `${testDirectory}/foo`;
    await mkdirp(destination);

    const actual = await isDirectory(destination);
    expect(actual).toBe(true);
  });
  it('should create nested directories', async () => {
    const destination = `${testDirectory}/foo/bar/baz`;
    await mkdirp(destination);

    const actual = await isDirectory(destination);
    expect(actual).toBe(true);
  });
  it('should create nested directories even if part of the path already exist', async () => {
    await mkdirp(`${testDirectory}/foo/bar`);

    const destination = `${testDirectory}/foo/bar/baz`;
    await mkdirp(destination);
    const actual = await isDirectory(destination);
    expect(actual).toBe(true);
  });
  it('should reject if part of the path is a file', async () => {
    await write('something', `${testDirectory}/foo_1`);

    let actual;
    try {
      await mkdirp(`${testDirectory}/foo_1/bar`);
    } catch (error) {
      actual = error;
    }

    expect(actual).toHaveProperty('code', 'ENOTDIR');
  });
  it('with relative paths', async () => {
    await runInUserland(
      dedent`
        const { mkdirp } = await __import('./mkdirp.js');
        return await mkdirp('./mydir');
      `,
      absolute(testDirectory, 'lib/app.js'),
    );

    const actual = await isDirectory(`${testDirectory}/lib/mydir`);
    expect(actual).toBe(true);
  });
});
