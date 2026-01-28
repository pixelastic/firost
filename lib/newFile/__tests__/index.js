import { absolute } from '../../absolute.js';
import { emptyDir } from '../../emptyDir.js';
import { isDirectory } from '../../isDirectory.js';
import { isFile } from '../../isFile.js';
import { mkdirp } from '../../mkdirp.js';
import { read } from '../../read.js';
import { remove } from '../../remove.js';
import { firostRoot } from '../../test-helpers/firostRoot.js';
import { runInUserland } from '../../test-helpers/runInUserland.js';
import { tmpDirectory } from '../../tmpDirectory.js';
import { write } from '../../write.js';
import { newFile } from '../index.js';

describe('newFile', () => {
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
  it('should create a directory if ends with a /', async () => {
    const input = `${tmpDir}/test/`;

    await newFile(input);

    expect(await isDirectory(input)).toBe(true);
  });
  it('should allow creating hidden files', async () => {
    const input = `${tmpDir}/.test`;

    await newFile(input);

    expect(await isFile(input)).toBe(true);
  });
  it('should allow creating hidden directories', async () => {
    const input = `${tmpDir}/.test/`;

    await newFile(input);

    expect(await isDirectory(input)).toBe(true);
  });
  it('should create a file if no extension given', async () => {
    const input = `${tmpDir}/test`;

    await newFile(input);

    expect(await isFile(input)).toBe(true);
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
  it('with <placeholders>', async () => {
    // Given
    const userlandTmpDir = tmpDirectory('firost/newFile');
    await mkdirp(absolute(userlandTmpDir, '.git'));

    // When
    await runInUserland(
      dedent`
          const { newFile } = await __import('./newFile/index.js');
          return await newFile('<gitRoot>/lib/src/file.txt');
        `,
      absolute(userlandTmpDir, 'lib/app.js'),
    );

    // Then
    const actual = await isFile(absolute(userlandTmpDir, 'lib/src/file.txt'));
    expect(actual).toEqual(true);

    // Cleanup
    await remove(userlandTmpDir);
  });
});
