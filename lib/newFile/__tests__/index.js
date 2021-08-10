const current = require('../index');
const isDirectory = require('../../isDirectory');
const read = require('../../read');
const write = require('../../write');
const emptyDir = require('../../emptyDir');

describe('mkdirp', () => {
  const tmpDir = './tmp/newFile';
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  it('should create a default html file', async () => {
    const input = `${tmpDir}/test.html`;

    await current(input);

    const actual = await read(input);
    expect(actual).toEqual('<!DOCTYPE html>');
  });
  it('should create an empty file if unknown extension', async () => {
    const input = `${tmpDir}/test.something`;

    await current(input);

    const actual = await read(input);
    expect(actual).toEqual('');
  });
  it('should create a directory if no extension given', async () => {
    const input = `${tmpDir}/test`;

    await current(input);

    expect(await isDirectory(input)).toEqual(true);
  });
  describe('overwriting existing files', () => {
    it('with template', async () => {
      const input = `${tmpDir}/test.html`;
      await write('nope', input);

      await current(input);

      const actual = await read(input);
      expect(actual).toEqual('<!DOCTYPE html>');
    });
    it('without template', async () => {
      const input = `${tmpDir}/test.something`;
      await write('nope', input);

      await current(input);

      const actual = await read(input);
      expect(actual).toEqual('');
    });
  });
});
