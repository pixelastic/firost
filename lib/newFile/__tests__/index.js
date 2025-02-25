import { newFile } from '../index.js';
import { isDirectory } from '../../isDirectory.js';
import { read } from '../../read.js';
import { write } from '../../write.js';
import { absolute } from '../../absolute.js';
import { emptyDir } from '../../emptyDir.js';
import firostRoot from '../../test-helpers/firostRoot.js';

describe('mkdirp', () => {
  const tmpDir = absolute(firostRoot, '/tmp/newFile');
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  it('should create a default html file', async () => {
    const input = `${tmpDir}/test.html`;

    await newFile(input);

    const actual = await read(input);
    expect(actual).toBe('<!DOCTYPE html>');
  });
  it('should create an empty file if unknown extension', async () => {
    const input = `${tmpDir}/test.something`;

    await newFile(input);

    const actual = await read(input);
    expect(actual).toBe('');
  });
  it('should create a directory if no extension given', async () => {
    const input = `${tmpDir}/test`;

    await newFile(input);

    expect(await isDirectory(input)).toBe(true);
  });
  describe('overwriting existing files', () => {
    it('with template', async () => {
      const input = `${tmpDir}/test.html`;
      await write('nope', input);

      await newFile(input);

      const actual = await read(input);
      expect(actual).toBe('<!DOCTYPE html>');
    });
    it('without template', async () => {
      const input = `${tmpDir}/test.something`;
      await write('nope', input);

      await newFile(input);

      const actual = await read(input);
      expect(actual).toBe('');
    });
  });
});
