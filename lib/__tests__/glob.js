import module from '../glob';
import mkdirp from '../mkdirp';
import write from '../write';
import emptyDir from '../emptyDir';

describe('glob', () => {
  const tmpDir = './tmp/glob';
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  it('should find files with *', async () => {
    await write('foo', `${tmpDir}/foo.txt`);

    const actual = await module(`${tmpDir}/*.txt`);

    expect(actual).toContain(`${tmpDir}/foo.txt`);
  });
  it('should find directories with *', async () => {
    await mkdirp(`${tmpDir}/folder`);

    const actual = await module(`${tmpDir}/*`);

    expect(actual).toContain(`${tmpDir}/folder`);
  });
  it('should exclude directories if directories: false', async () => {
    await mkdirp(`${tmpDir}/folder`);

    const actual = await module(`${tmpDir}/*`, { directories: false });

    expect(actual).not.toContain(`${tmpDir}/first`);
  });
  it('should find hidden files by default', async () => {
    await write('foo', `${tmpDir}/.foo`);

    const actual = await module(`${tmpDir}/*`);

    expect(actual).toContain(`${tmpDir}/.foo`);
  });
  it('should exclude hidden files if hiddenFiles: false', async () => {
    await write('foo', `${tmpDir}/.foo`);

    const actual = await module(`${tmpDir}/*`, { hiddenFiles: false });

    expect(actual).not.toContain(`${tmpDir}/.foo`);
  });
  it('should find files with **', async () => {
    await write('foo', `${tmpDir}/foo.txt`);
    await write('bar', `${tmpDir}/one/bar.txt`);
    await write('baz', `${tmpDir}/one/two/baz.txt`);

    const actual = await module(`${tmpDir}/**/*.txt`);

    expect(actual).toContain(`${tmpDir}/foo.txt`);
    expect(actual).toContain(`${tmpDir}/one/bar.txt`);
    expect(actual).toContain(`${tmpDir}/one/two/baz.txt`);
  });
  it('should return results ordered', async () => {
    await write('foo', `${tmpDir}/foo_1`);
    await write('foo', `${tmpDir}/foo_10`);
    await write('foo', `${tmpDir}/foo_18`);
    await write('foo', `${tmpDir}/foo_100`);
    await write('foo', `${tmpDir}/foo_179`);
    await write('foo', `${tmpDir}/foo_180`);
    await write('foo', `${tmpDir}/foo_bar`);

    const actual = await module(`${tmpDir}/foo*`);

    expect(actual).toEqual([
      `${tmpDir}/foo_1`,
      `${tmpDir}/foo_10`,
      `${tmpDir}/foo_18`,
      `${tmpDir}/foo_100`,
      `${tmpDir}/foo_179`,
      `${tmpDir}/foo_180`,
      `${tmpDir}/foo_bar`,
    ]);
  });
  it('should allow several patterns as array', async () => {
    await write('foo', `${tmpDir}/foo.txt`);
    await write('bar', `${tmpDir}/bar.gif`);

    const actual = await module([`${tmpDir}/*.gif`, `${tmpDir}/*.txt`]);

    expect(actual).toContain(`${tmpDir}/foo.txt`);
    expect(actual).toContain(`${tmpDir}/bar.gif`);
  });
  it('should allow negated patterns in array', async () => {
    await write('foo', `${tmpDir}/one/foo.txt`);
    await write('bar', `${tmpDir}/one/two/bar.txt`);

    const actual = await module([
      `${tmpDir}/**/*.txt`,
      `!${tmpDir}/one/two/bar.txt`,
    ]);

    expect(actual).toContain(`${tmpDir}/one/foo.txt`);
    expect(actual).not.toContain(`${tmpDir}/one/two/bar.txt`);
  });
});
