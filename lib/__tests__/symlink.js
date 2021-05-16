const current = require('../symlink');
const write = require('../write');
const emptyDir = require('../emptyDir');
const isSymlink = require('../isSymlink');
const path = require('path');
const pProps = require('golgoth/pProps');

describe('symlink', () => {
  const tmpDir = './tmp/symlink';
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
    await current(linkPath, target);

    const actual = await isSymlink(linkPath);
    expect(actual).toEqual(true);
  });
  it('should overwrite a broken symlink', async () => {
    await write('File content', `${tmpDir}/file.txt`);
    await current(`${tmpDir}/link.txt`, './missing-file.txt');
    await current(`${tmpDir}/link.txt`, './file.txt');

    const actual = await isSymlink(`${tmpDir}/link.txt`);
    expect(actual).toEqual(true);
  });
});
