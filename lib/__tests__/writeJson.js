import current from '../writeJson.js';
import readJson from '../readJson.js';
import read from '../read.js';
import emptyDir from '../emptyDir.js';
import exists from '../exists.js';

describe('writeJson', () => {
  const tmpDir = './tmp/writeJson';
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  it('should create a file with the given content', async () => {
    await current({ foo: 'bar' }, `${tmpDir}/foo.json`);

    const actual = await readJson(`${tmpDir}/foo.json`);
    expect(actual).toHaveProperty('foo', 'bar');
  });
  it('should overwrite an existing file', async () => {
    await current({ foo: 'bar' }, `${tmpDir}/foo.json`);
    await current({ foo: 'baz' }, `${tmpDir}/foo.json`);

    const actual = await readJson(`${tmpDir}/foo.json`);
    expect(actual).toHaveProperty('foo', 'baz');
  });
  it('should create nested directories', async () => {
    await current({ foo: 'bar' }, `${tmpDir}/one/two/foo.json`);

    const actual = await readJson(`${tmpDir}/one/two/foo.json`);
    expect(actual).toHaveProperty('foo', 'bar');
  });
  it('should do nothing if given undefined as content', async () => {
    await current(undefined, `${tmpDir}/file.json`);

    expect(await exists(`${tmpDir}/file.json`)).toBe(false);
  });
  it('should pretty print the output', async () => {
    await current({ foo: 'bar', bar: 'baz' }, `${tmpDir}/foo.json`);

    const actual = await read(`${tmpDir}/foo.json`);
    expect(actual).toMatchSnapshot();
  });
  it('should sort the object keys, to ease diffing', async () => {
    await current(
      { zoo: 'bar', coo: 'bar', moo: 'bar', foo: 'bar' },
      `${tmpDir}/foo.json`,
    );

    const actual = await read(`${tmpDir}/foo.json`);
    expect(actual).toMatchSnapshot();
  });
  it('should not sort the object keys with { sort: false }', async () => {
    await current(
      { zoo: 'bar', coo: 'bar', moo: 'bar', foo: 'bar' },
      `${tmpDir}/foo.json`,
      { sort: false },
    );

    const actual = await read(`${tmpDir}/foo.json`);
    expect(actual).toMatchSnapshot();
  });
  it('should prettify the output if prettier is available', async () => {
    const mockFormat = vi.fn().mockReturnValue('pretty');
    vi.spyOn(current, '__require').mockReturnValue({ format: mockFormat });
    await current({ foo: 'bar' }, `${tmpDir}/foo.json`);

    const actual = await read(`${tmpDir}/foo.json`);
    expect(actual).toBe('pretty');

    expect(current.__require).toHaveBeenCalledWith('prettier');
    expect(mockFormat).toHaveBeenCalledWith('{\n  "foo": "bar"\n}', {
      parser: 'json',
    });
  });
});
