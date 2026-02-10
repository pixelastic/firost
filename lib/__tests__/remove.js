import { absolute } from '../absolute.js';
import { exists } from '../exists.js';
import { glob } from '../glob.js';
import { isFile } from '../isFile.js';
import { mkdirp } from '../mkdirp.js';
import { newFile } from '../newFile/index.js';
import { remove } from '../remove.js';
import { symlink } from '../symlink.js';
import { runInUserland } from '../test-helpers/runInUserland.js';
import { tmpDirectory } from '../tmpDirectory.js';

describe('remove', () => {
  const testDirectory = tmpDirectory(`firost/${describeName}`);
  afterEach(async () => {
    await remove(testDirectory);
  });
  it('should stay silent if the file does not exist', async () => {
    let actual = 'unchanged';

    try {
      await remove(`${testDirectory}/nope.nope`);
    } catch (error) {
      actual = error;
    }

    expect(actual).toBe('unchanged');
  });
  it('should delete the target file', async () => {
    await newFile(`${testDirectory}/foo.txt`);

    await remove(`${testDirectory}/foo.txt`);

    expect(await exists(`${testDirectory}/foo.txt`)).toBe(false);
  });
  it('should delete the target directory', async () => {
    await mkdirp(`${testDirectory}/folder`);

    await remove(`${testDirectory}/folder`);

    expect(await exists(`${testDirectory}/folder`)).toBe(false);
  });
  it('should accept an array of filepaths', async () => {
    await newFile(`${testDirectory}/file1.txt`);
    await newFile(`${testDirectory}/file2.jpg`);
    await newFile(`${testDirectory}/file3.png`);

    await remove([`${testDirectory}/file1.txt`, `${testDirectory}/file2.jpg`]);

    const remainingFiles = await glob('*', { cwd: testDirectory });
    expect(remainingFiles).toEqual([`${testDirectory}/file3.png`]);
  });
  it('should delete all matching globs', async () => {
    await newFile(`${testDirectory}/foo.txt`);
    await newFile(`${testDirectory}/bar.txt`);
    await newFile(`${testDirectory}/baz.txt`);

    await remove(`${testDirectory}/b*.txt`);

    expect(await exists(`${testDirectory}/bar.txt`)).toBe(false);
    expect(await exists(`${testDirectory}/baz.txt`)).toBe(false);
  });
  it('should delete the symlink, not the file referenced by the symlink', async () => {
    const filePath = `${testDirectory}/foo.txt`;
    const linkPath = `${testDirectory}/link.txt`;
    await newFile(filePath);
    await symlink(linkPath, filePath);

    await remove(linkPath);

    expect(await exists(linkPath)).toBe(false);
    expect(await exists(filePath)).toBe(true);
  });
  it('with relative paths', async () => {
    await newFile(`${testDirectory}/lib/file.txt`);

    await runInUserland(
      dedent`
        const { remove } = await __import('./remove.js');
        return await remove('./file.txt');
      `,
      absolute(testDirectory, 'lib/app.js'),
    );

    const actual = await isFile(`${testDirectory}/lib/file.txt`);
    expect(actual).toEqual(false);
  });
});
