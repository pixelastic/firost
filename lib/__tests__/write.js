import module from '../write';
import helper from '../test-helper';
import read from '../read';
const tmpPath = helper.tmpPath('write');

describe('write', () => {
  beforeEach(async () => {
    await helper.clearTmpDirectory('write');
  });
  it('should create a file with the given content', async () => {
    const destination = `${tmpPath}/destination.txt`;
    await module('foo', destination);

    const actual = await read(destination);
    expect(actual).toEqual('foo');
  });
  it('should overwrite an existing file', async () => {
    const destination = `${tmpPath}/destination.txt`;
    // Set the first content
    await module('foo', destination);

    await module('bar', destination);
    const actual = await read(destination);
    expect(actual).toEqual('bar');
  });
  it('should create nested directories', async () => {
    const destination = `${tmpPath}/foo/bar/destination.txt`;
    await module('foo', destination);

    const actual = await read(destination);
    expect(actual).toEqual('foo');
  });
});
