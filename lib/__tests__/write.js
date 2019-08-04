import module from '../write';
import read from '../read';
import emptyDir from '../emptyDir';

describe('write', () => {
  const tmpDir = './tmp/write';
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  it('should create a file with the given content', async () => {
    await module('foo', `${tmpDir}/foo.txt`);

    expect(await read(`${tmpDir}/foo.txt`)).toEqual('foo');
  });
  it('should overwrite an existing file', async () => {
    await module('foo', `${tmpDir}/foo.txt`);
    await module('bar', `${tmpDir}/foo.txt`);

    expect(await read(`${tmpDir}/foo.txt`)).toEqual('bar');
  });
  it('should create nested directories', async () => {
    await module('foo', `${tmpDir}/one/two/foo.txt`);

    expect(await read(`${tmpDir}/one/two/foo.txt`)).toEqual('foo');
  });
});
