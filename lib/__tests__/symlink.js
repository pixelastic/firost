import path from 'node:path';
import { pMap } from 'golgoth';
import { absolute } from '../absolute.js';
import { isSymlink } from '../isSymlink.js';
import { newFile } from '../newFile/index.js';
import { remove } from '../remove.js';
import { symlink } from '../symlink.js';
import { runInUserland } from '../test-helpers/runInUserland.js';
import { tmpDirectory } from '../tmpDirectory.js';

describe('symlink', () => {
  const testDirectory = tmpDirectory(`firost/${describeName}`);
  afterEach(async () => {
    await remove(testDirectory);
  });
  it.each([
    {
      title: 'to a file',
      setupFiles: ['file.txt'],
      filepath: 'link.txt',
      target: path.resolve(`${testDirectory}/file.txt`),
    },
    {
      title: 'to a directory',
      setupFiles: ['subdir/file.txt'],
      filepath: 'link',
      target: path.resolve(`${testDirectory}/subdir`),
    },
    {
      title: 'relative link',
      setupFiles: ['file.txt'],
      filepath: 'link.txt',
      target: './file.txt',
    },
    {
      title: 'broken symlink',
      setupFiles: [],
      filepath: 'link.txt',
      target: './missing-file.txt',
    },
    {
      title: 'create tree structure',
      setupFiles: ['file.txt'],
      filepath: 'very/deep/subdir/link.txt',
      target: path.resolve(`${testDirectory}/file.txt`),
    },
    {
      title: 'overwrite existing file',
      setupFiles: ['file.txt', 'link.txt'],
      filepath: 'link.txt',
      target: './file.txt',
    },
    {
      title: 'overwrite existing directory',
      setupFiles: ['file.txt', 'subdir/link.txt'],
      filepath: 'subdir',
      target: './file.txt',
    },
  ])('$title', async ({ setupFiles, filepath, target }) => {
    await pMap(setupFiles, async (file) => {
      await newFile(`${testDirectory}/${file}`);
    });

    const linkPath = path.resolve(`${testDirectory}/${filepath}`);
    await symlink(linkPath, target);

    const actual = await isSymlink(linkPath);
    expect(actual).toBe(true);
  });
  it('should overwrite a broken symlink', async () => {
    await newFile(`${testDirectory}/file.txt`);
    await symlink(`${testDirectory}/link.txt`, './missing-file.txt');
    await symlink(`${testDirectory}/link.txt`, './file.txt');

    const actual = await isSymlink(`${testDirectory}/link.txt`);
    expect(actual).toBe(true);
  });
  it('with relative paths', async () => {
    await newFile(`${testDirectory}/lib/file.txt`);

    await runInUserland(
      dedent`
        const { symlink } = await __import('./symlink.js');
        return await symlink('./link.txt', './file.txt');
      `,
      absolute(testDirectory, 'lib/app.js'),
    );

    const actual = await isSymlink(`${testDirectory}/lib/link.txt`);
    expect(actual).toBe(true);
  });
});
