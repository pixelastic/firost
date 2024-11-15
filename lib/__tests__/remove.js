import absolute from '../absolute.js';
import current from '../remove.js';
import exists from '../exists.js';
import write from '../write.js';
import mkdirp from '../mkdirp.js';
import emptyDir from '../emptyDir.js';
import symlink from '../symlink.js';
import firostRoot from '../test-helpers/firostRoot.js';

describe('remove', () => {
  const tmpDir = absolute(firostRoot, '/tmp/remove');
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  it('should stay silent if the file does not exist', async () => {
    let actual = 'unchanged';

    try {
      await current(`${tmpDir}/nope.nope`);
    } catch (error) {
      actual = error;
    }

    expect(actual).toBe('unchanged');
  });
  it('should delete the target file', async () => {
    await write('foo', `${tmpDir}/foo.txt`);

    await current(`${tmpDir}/foo.txt`);

    expect(await exists(`${tmpDir}/foo.txt`)).toBe(false);
  });
  it('should delete the target directory', async () => {
    await mkdirp(`${tmpDir}/folder`);

    await current(`${tmpDir}/folder`);

    expect(await exists(`${tmpDir}/folder`)).toBe(false);
  });
  it('should delete all matching globs', async () => {
    await write('foo', `${tmpDir}/foo.txt`);
    await write('bar', `${tmpDir}/bar.txt`);
    await write('baz', `${tmpDir}/baz.txt`);

    await current(`${tmpDir}/b*.txt`);

    expect(await exists(`${tmpDir}/bar.txt`)).toBe(false);
    expect(await exists(`${tmpDir}/baz.txt`)).toBe(false);
  });
  it('should delete the symlink, not the file referenced by the symlink', async () => {
    const filePath = `${tmpDir}/foo.txt`;
    const linkPath = `${tmpDir}/link.txt`;
    await write('foo', filePath);
    await symlink(linkPath, filePath);

    await current(linkPath);

    expect(await exists(linkPath)).toBe(false);
    expect(await exists(filePath)).toBe(true);
  });
});
