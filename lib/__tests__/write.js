const current = require('../write');
const read = require('../read');
const emptyDir = require('../emptyDir');

describe('write', () => {
  const tmpDir = './tmp/write';
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  it('should create a file with the given content', async () => {
    await current('foo', `${tmpDir}/foo.txt`);

    expect(await read(`${tmpDir}/foo.txt`)).toEqual('foo');
  });
  it('should overwrite an existing file', async () => {
    await current('foo', `${tmpDir}/foo.txt`);
    await current('bar', `${tmpDir}/foo.txt`);

    expect(await read(`${tmpDir}/foo.txt`)).toEqual('bar');
  });
  it('should create nested directories', async () => {
    await current('foo', `${tmpDir}/one/two/foo.txt`);

    expect(await read(`${tmpDir}/one/two/foo.txt`)).toEqual('foo');
  });
});
