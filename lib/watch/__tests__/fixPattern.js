import current from '../fixPattern.js';
import write from '../../write.js';
import emptyDir from '../../emptyDir.js';
import path from 'path';

describe('watch > fixPattern', () => {
  const tmpDir = './tmp/watch/fixPattern';
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  it('should keep paths absolute if given as absolute', async () => {
    const pattern = path.resolve(`${tmpDir}/foo.txt`);
    await write('foo', pattern);

    const actual = await current(pattern);

    expect(actual).toEqual(pattern);
  });
  it('should keep path relatives if given as relative', async () => {
    const pattern = `${tmpDir}/foo.txt`;
    await write('foo', pattern);

    const actual = await current(pattern);

    expect(actual).toEqual(pattern);
  });
  it('should replace non-existing dirs with regexp still matching', async () => {
    const pattern = `${tmpDir}/nope/*.txt`;

    const actual = await current(pattern);

    expect(actual).toBe(`${tmpDir}/(nope|$*)/*.txt`);
  });
  it('should fix all patterns in an array', async () => {
    await write('foo', `${tmpDir}/foo.txt`);

    const actual = await current([`${tmpDir}/nope/*.txt`, `${tmpDir}/*.txt`]);

    expect(actual[0]).toBe(`${tmpDir}/(nope|$*)/*.txt`);
    expect(actual[1]).toBe(`${tmpDir}/*.txt`);
  });
  it('should not remove negating pattern', async () => {
    await write('foo', `${tmpDir}/foo.txt`);

    const actual = await current([`${tmpDir}/**/*.txt`, `!${tmpDir}/nope.txt`]);

    expect(actual[0]).toBe(`${tmpDir}/**/*.txt`);
    expect(actual[1]).toBe(`!${tmpDir}/nope.txt`);
  });
});
