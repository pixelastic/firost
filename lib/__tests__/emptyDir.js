import absolute from '../absolute.js';
import current from '../emptyDir.js';
import mkdirp from '../mkdirp.js';
import exists from '../exists.js';
import remove from '../remove.js';
import write from '../write.js';

describe('emptyDir', () => {
  const tmpDir = absolute('<gitRoot>/tmp/emptyDir');
  beforeEach(async () => {
    if (await exists(tmpDir)) {
      await remove(tmpDir);
    }
    await mkdirp(tmpDir);
  });
  it('should have removed all content of the directory', async () => {
    await write('foo', `${tmpDir}/folder/foo.txt`);
    await write('bar', `${tmpDir}/folder/bar.txt`);

    await current(`${tmpDir}/folder`);

    expect(await exists(`${tmpDir}/folder/foo.txt`)).toBe(false);
    expect(await exists(`${tmpDir}/folder/bar.txt`)).toBe(false);
  });
  it('should return true when done', async () => {
    await write('foo', `${tmpDir}/folder/foo.txt`);

    const actual = await current(`${tmpDir}/folder`);

    expect(actual).toBe(true);
  });
  it('should return true even if folder was empty', async () => {
    await mkdirp(`${tmpDir}/folder`);

    const actual = await current(`${tmpDir}/folder`);

    expect(actual).toBe(true);
  });
  it('should return false if folder does not exist', async () => {
    const actual = await current(`${tmpDir}/folder`);

    expect(actual).toBe(false);
  });
  it('should return false if not a folder', async () => {
    await write('foo', `${tmpDir}/foo.txt`);

    const actual = await current(`${tmpDir}/foo.txt`);

    expect(actual).toBe(false);
  });
});
