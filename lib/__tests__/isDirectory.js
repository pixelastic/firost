import { absolute } from '../absolute.js';
import { isDirectory } from '../isDirectory.js';
import { mkdirp } from '../mkdirp.js';
import { remove } from '../remove.js';
import { symlink } from '../symlink.js';
import { runInUserland } from '../test-helpers/runInUserland.js';
import { tmpDirectory } from '../tmpDirectory.js';
import { write } from '../write.js';

describe('isDirectory', () => {
  const testDirectory = tmpDirectory('firost/isDirectory');
  afterEach(async () => {
    await remove(testDirectory);
  });
  it('should return true if target is a directory', async () => {
    await mkdirp(`${testDirectory}/folder`);

    const actual = await isDirectory(`${testDirectory}/folder`);

    expect(actual).toBe(true);
  });
  it('should return false if target is a file', async () => {
    await write('something', `${testDirectory}/foo.txt`);

    const actual = await isDirectory(`${testDirectory}/foo.txt`);

    expect(actual).toBe(false);
  });
  it('should return false if target does not exist', async () => {
    const actual = await isDirectory(`${testDirectory}/nope`);

    expect(actual).toBe(false);
  });
  it('should return true if target is a symlink to a directory', async () => {
    const targetPath = `${testDirectory}/folder`;
    const linkPath = `${testDirectory}/link`;
    await mkdirp(targetPath);
    await symlink(linkPath, './folder');

    const actual = await isDirectory(linkPath);

    expect(actual).toBe(true);
  });
  it('with relative paths', async () => {
    await mkdirp(`${testDirectory}/lib/mydir`);

    const actual = await runInUserland(
      dedent`
        const { isDirectory } = await __import('./isDirectory.js');
        return await isDirectory('./mydir');
      `,
      absolute(testDirectory, 'lib/app.js'),
    );

    expect(actual).toBe(true);
  });
});
