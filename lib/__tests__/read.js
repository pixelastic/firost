import { absolute } from '../absolute.js';
import { read } from '../read.js';
import { remove } from '../remove.js';
import { runInUserland } from '../test-helpers/runInUserland.js';
import { tmpDirectory } from '../tmpDirectory.js';
import { write } from '../write.js';

describe('read', () => {
  const testDirectory = tmpDirectory('firost/read');
  afterEach(async () => {
    await remove(testDirectory);
  });
  describe('reading files', () => {
    it.each([['foo'], ['✓‽⛀']])('%s', async (input) => {
      await write(input, `${testDirectory}/input.txt`);

      const actual = await read(`${testDirectory}/input.txt`);

      expect(actual).toEqual(input);
    });
  });
  describe('errors', () => {
    it('should throw ENOENT for non-existent file', async () => {
      let actual;
      try {
        await read(`${testDirectory}/file/that/does/not/exist.txt`);
      } catch (err) {
        actual = err;
      }
      expect(actual).toHaveProperty('code', 'ENOENT');
    });
    it('should throw EISDIR when trying to read a directory', async () => {
      await write('dummy', `${testDirectory}/dummy.txt`);

      let actual;
      try {
        await read(testDirectory);
      } catch (err) {
        actual = err;
      }
      expect(actual).toHaveProperty('code', 'EISDIR');
    });
  });
  it('with relative paths', async () => {
    await write('something', `${testDirectory}/lib/file.txt`);

    const actual = await runInUserland(
      dedent`
        const { read } = await __import('./read.js');
        return await read('./file.txt');
      `,
      absolute(testDirectory, 'lib/app.js'),
    );

    expect(actual).toEqual('something');
  });
});
