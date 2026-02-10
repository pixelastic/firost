import { absolute } from '../absolute.js';
import { isFile } from '../isFile.js';
import { mkdirp } from '../mkdirp.js';
import { remove } from '../remove.js';
import { symlink } from '../symlink.js';
import { runInUserland } from '../test-helpers/runInUserland.js';
import { tmpDirectory } from '../tmpDirectory.js';
import { write } from '../write.js';

describe('isFile', () => {
  const testDirectory = tmpDirectory('firost/isFile');
  afterEach(async () => {
    await remove(testDirectory);
  });
  it('should return true if target is a file', async () => {
    await write('something', `${testDirectory}/file.txt`);
    const actual = await isFile(`${testDirectory}/file.txt`);

    expect(actual).toBe(true);
  });
  it('should return false if target is a directory', async () => {
    await mkdirp(`${testDirectory}/file`);
    const actual = await isFile(`${testDirectory}/file`);

    expect(actual).toBe(false);
  });
  it('should return false if target does not exist', async () => {
    const actual = await isFile(`${testDirectory}/nope.nope`);

    expect(actual).toBe(false);
  });
  it('should return true if target is a symlink to a file', async () => {
    const filePath = `${testDirectory}/foo.txt`;
    const linkPath = `${testDirectory}/link.txt`;
    await write('something', filePath);
    await symlink(linkPath, './foo.txt');

    const actual = await isFile(linkPath);

    expect(actual).toBe(true);
  });
  it('with relative paths', async () => {
    await write('something', `${testDirectory}/lib/file.txt`);

    const actual = await runInUserland(
      dedent`
        const { isFile } = await __import('./isFile.js');
        return await isFile('./file.txt');
      `,
      absolute(testDirectory, 'lib/app.js'),
    );

    expect(actual).toBe(true);
  });
});
