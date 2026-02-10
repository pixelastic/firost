import { remove, tmpDirectory } from 'firost';
import { isDirectory } from '../../isDirectory.js';
import { isFile } from '../../isFile.js';
import { read } from '../../read.js';
import { write } from '../../write.js';
import { newFile } from '../index.js';

describe('newFile', () => {
  const testDirectory = tmpDirectory('firost/newFile');
  afterEach(async () => {
    await remove(testDirectory);
  });
  it('should create a default html file', async () => {
    const input = `${testDirectory}/test.html`;

    await newFile(input);

    const actual = await read(input);
    expect(actual).toBe('<!DOCTYPE html>');
  });
  it('should create an empty file if unknown extension', async () => {
    const input = `${testDirectory}/test.something`;

    await newFile(input);

    const actual = await read(input);
    expect(actual).toBe('');
  });
  it('should create a directory if ends with a /', async () => {
    const input = `${testDirectory}/test/`;

    await newFile(input);

    expect(await isDirectory(input)).toBe(true);
  });
  it('should allow creating hidden files', async () => {
    const input = `${testDirectory}/.test`;

    await newFile(input);

    expect(await isFile(input)).toBe(true);
  });
  it('should allow creating hidden directories', async () => {
    const input = `${testDirectory}/.test/`;

    await newFile(input);

    expect(await isDirectory(input)).toBe(true);
  });
  it('should create a file if no extension given', async () => {
    const input = `${testDirectory}/test`;

    await newFile(input);

    expect(await isFile(input)).toBe(true);
  });
  describe('overwriting existing files', () => {
    it('with template', async () => {
      const input = `${testDirectory}/test.html`;
      await write('nope', input);

      await newFile(input);

      const actual = await read(input);
      expect(actual).toBe('<!DOCTYPE html>');
    });
    it('without template', async () => {
      const input = `${testDirectory}/test.something`;
      await write('nope', input);

      await newFile(input);

      const actual = await read(input);
      expect(actual).toBe('');
    });
  });
});
