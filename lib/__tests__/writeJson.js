import module from '../writeJson';
import readJson from '../readJson';
import read from '../read';
import emptyDir from '../emptyDir';

describe('writeJson', () => {
  const tmpDir = './tmp/writeJson';
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  it('should create a file with the given content', async () => {
    await module({ foo: 'bar' }, `${tmpDir}/foo.json`);

    const actual = await readJson(`${tmpDir}/foo.json`);
    expect(actual).toHaveProperty('foo', 'bar');
  });
  it('should overwrite an existing file', async () => {
    await module({ foo: 'bar' }, `${tmpDir}/foo.json`);
    await module({ foo: 'baz' }, `${tmpDir}/foo.json`);

    const actual = await readJson(`${tmpDir}/foo.json`);
    expect(actual).toHaveProperty('foo', 'baz');
  });
  it('should create nested directories', async () => {
    await module({ foo: 'bar' }, `${tmpDir}/one/two/foo.json`);

    const actual = await readJson(`${tmpDir}/one/two/foo.json`);
    expect(actual).toHaveProperty('foo', 'bar');
  });
  it('should pretty print the output', async () => {
    await module({ foo: 'bar', bar: 'baz' }, `${tmpDir}/foo.json`);

    const actual = await read(`${tmpDir}/foo.json`);
    expect(actual).toMatchSnapshot();
  });
  it('should sort the object keys, to ease diffing', async () => {
    await module(
      { zoo: 'bar', coo: 'bar', moo: 'bar', foo: 'bar' },
      `${tmpDir}/foo.json`
    );

    const actual = await read(`${tmpDir}/foo.json`);
    expect(actual).toMatchSnapshot();
  });
  it('should not sort the object keys with { sort: false }', async () => {
    await module(
      { zoo: 'bar', coo: 'bar', moo: 'bar', foo: 'bar' },
      `${tmpDir}/foo.json`,
      { sort: false }
    );

    const actual = await read(`${tmpDir}/foo.json`);
    expect(actual).toMatchSnapshot();
  });
  it('should prettify the output if prettier is available', async () => {
    const mockFormat = jest.fn().mockReturnValue('pretty');
    jest.spyOn(module, '__require').mockReturnValue({ format: mockFormat });
    await module({ foo: 'bar' }, `${tmpDir}/foo.json`);

    const actual = await read(`${tmpDir}/foo.json`);
    expect(actual).toEqual('pretty');

    expect(module.__require).toHaveBeenCalledWith('prettier');
    expect(mockFormat).toHaveBeenCalledWith('{\n  "foo": "bar"\n}', {
      parser: 'json',
    });
  });
});
