import module from '../writeJson';
import helper from '../test-helper';
import readJson from '../readJson';
import read from '../read';
const tmpPath = helper.tmpPath('writeJson');

describe('writeJson', () => {
  beforeEach(async () => {
    await helper.clearTmpDirectory('writeJson');
  });
  it('should create a file with the given content', async () => {
    const destination = `${tmpPath}/destination.json`;
    await module({ foo: 'bar' }, destination);

    const actual = await readJson(destination);
    expect(actual).toHaveProperty('foo', 'bar');
  });
  it('should overwrite an existing file', async () => {
    const destination = `${tmpPath}/destination.json`;
    // Set the first content
    await module({ foo: 'bar' }, destination);

    await module({ foo: 'baz' }, destination);
    const actual = await readJson(destination);
    expect(actual).toHaveProperty('foo', 'baz');
  });
  it('should create nested directories', async () => {
    const destination = `${tmpPath}/foo/bar/destination.json`;
    await module({ foo: 'bar' }, destination);

    const actual = await readJson(destination);
    expect(actual).toHaveProperty('foo', 'bar');
  });
  it('should pretty print the output', async () => {
    const destination = `${tmpPath}/destination.json`;
    await module({ foo: 'bar', bar: 'baz' }, destination);

    const actual = await read(destination);
    expect(actual).toMatchSnapshot();
  });
  it('should sort the object keys, to ease diffing', async () => {
    const destination = `${tmpPath}/destination.json`;
    await module(
      { zoo: 'bar', coo: 'bar', moo: 'bar', foo: 'bar' },
      destination
    );

    const actual = await read(destination);
    expect(actual).toMatchSnapshot();
  });
  it('should not sort the object keys with { sort: false }', async () => {
    const destination = `${tmpPath}/destination.json`;
    await module(
      { zoo: 'bar', coo: 'bar', moo: 'bar', foo: 'bar' },
      destination,
      { sort: false }
    );

    const actual = await read(destination);
    expect(actual).toMatchSnapshot();
  });
});
