import absolute from '../absolute.js';
import current from '../isDirectory.js';
import mkdirp from '../mkdirp.js';
import write from '../write.js';
import emptyDir from '../emptyDir.js';
import symlink from '../symlink.js';
import firostRoot from '../test-helpers/firostRoot.js';

describe('isDirectory', () => {
  const tmpDir = absolute(firostRoot, '/tmp/isDirectory');
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  it('should return true if target is a directory', async () => {
    await mkdirp(`${tmpDir}/folder`);

    const actual = await current(`${tmpDir}/folder`);

    expect(actual).toBe(true);
  });
  it('should return false if target is a file', async () => {
    await write('foo', `${tmpDir}/foo.txt`);

    const actual = await current(`${tmpDir}/foo.txt`);

    expect(actual).toBe(false);
  });
  it('should return false if target does not exist', async () => {
    const actual = await current(`${tmpDir}/nope`);

    expect(actual).toBe(false);
  });
  it('should return true if target is a symlink to a directory', async () => {
    const targetPath = `${tmpDir}/folder`;
    const linkPath = `${tmpDir}/link`;
    await mkdirp(targetPath);
    await symlink(linkPath, './folder');

    const actual = await current(linkPath);

    expect(actual).toBe(true);
  });
});
