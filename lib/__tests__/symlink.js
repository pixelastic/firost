import path from 'node:path';
import { pProps } from 'golgoth';
import { absolute } from '../absolute.js';
import { emptyDir } from '../emptyDir.js';
import { isSymlink } from '../isSymlink.js';
import { symlink } from '../symlink.js';
import { firostRoot } from '../test-helpers/firostRoot.js';
import { write } from '../write.js';

describe('symlink', () => {
  const tmpDir = absolute(firostRoot, '/tmp/symlink');
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  it.each([
    [
      'to a file',
      {
        'file.txt': 'file content',
      },
      {
        filepath: 'link.txt',
        target: path.resolve(`${tmpDir}/file.txt`),
      },
    ],
    [
      'to a directory',
      {
        'subdir/file.txt': 'file content',
      },
      {
        filepath: 'link',
        target: path.resolve(`${tmpDir}/subdir`),
      },
    ],
    [
      'relative link',
      {
        'file.txt': 'file content',
      },
      {
        filepath: 'link.txt',
        target: './file.txt',
      },
    ],
    [
      'broken symlink',
      {},
      {
        filepath: 'link.txt',
        target: './missing-file.txt',
      },
    ],
    [
      'create tree structure',
      {
        'file.txt': 'file content',
      },
      {
        filepath: 'very/deep/subdir/link.txt',
        target: path.resolve(`${tmpDir}/file.txt`),
      },
    ],
    [
      'overwrite existing file',
      {
        'file.txt': 'file content',
        'link.txt': 'existing file',
      },
      {
        filepath: 'link.txt',
        target: './file.txt',
      },
    ],
    [
      'overwrite existing directory',
      {
        'file.txt': 'file content',
        'subdir/link.txt': 'existing file',
      },
      {
        filepath: 'subdir',
        target: './file.txt',
      },
    ],
  ])('%s', async (_title, files, args) => {
    await pProps(files, async (content, filepath) => {
      await write(content, `${tmpDir}/${filepath}`);
    });

    const { filepath, target } = args;
    const linkPath = path.resolve(`${tmpDir}/${filepath}`);
    await symlink(linkPath, target);

    const actual = await isSymlink(linkPath);
    expect(actual).toBe(true);
  });
  it('should overwrite a broken symlink', async () => {
    await write('File content', `${tmpDir}/file.txt`);
    await symlink(`${tmpDir}/link.txt`, './missing-file.txt');
    await symlink(`${tmpDir}/link.txt`, './file.txt');

    const actual = await isSymlink(`${tmpDir}/link.txt`);
    expect(actual).toBe(true);
  });
});
