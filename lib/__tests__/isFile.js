import absolute from '../absolute.js';
import current from '../isFile.js';
import write from '../write.js';
import mkdirp from '../mkdirp.js';
import emptyDir from '../emptyDir.js';
import symlink from '../symlink.js';
import firostRoot from '../test-helpers/firostRoot.js';

describe('isFile', () => {
  const tmpDir = absolute(firostRoot, '/tmp/isFile');
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  it('should return true if target is a file', async () => {
    await write('foo', `${tmpDir}/file.txt`);
    const actual = await current(`${tmpDir}/file.txt`);

    expect(actual).toBe(true);
  });
  it('should return false if target is a directory', async () => {
    await mkdirp(`${tmpDir}/file`);
    const actual = await current(`${tmpDir}/file`);

    expect(actual).toBe(false);
  });
  it('should return false if target does not exist', async () => {
    const actual = await current(`${tmpDir}/nope.nope`);

    expect(actual).toBe(false);
  });
  it('should return true if target is a symlink to a file', async () => {
    const filePath = `${tmpDir}/foo.txt`;
    const linkPath = `${tmpDir}/link.txt`;
    await write('file content', filePath);
    await symlink(linkPath, './foo.txt');

    const actual = await current(linkPath);

    expect(actual).toBe(true);
  });
});
