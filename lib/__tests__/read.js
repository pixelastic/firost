import { absolute } from '../absolute.js';
import { read } from '../read.js';
import { write } from '../write.js';
import { emptyDir } from '../emptyDir.js';
import { firostRoot } from '../test-helpers/firostRoot.js';

describe('read', () => {
  const tmpDir = absolute(firostRoot, '/tmp/read');
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  describe('reading files', () => {
    it.each([['foo'], ['✓‽⛀']])('%s', async (input) => {
      await write(input, `${tmpDir}/input.txt`);

      const actual = await read(`${tmpDir}/input.txt`);

      expect(actual).toEqual(input);
    });
  });
  describe('errors', () => {
    it.each([
      [`${tmpDir}/file/that/does/not/exist.txt`, 'ENOENT'],
      [tmpDir, 'EISDIR'],
    ])('%s', async (input, expected) => {
      let actual;
      try {
        await read(input);
      } catch (err) {
        actual = err;
      }
      expect(actual).toHaveProperty('code', expected);
    });
  });
  it('understands <placeholders>', async () => {
    await write('something', `${tmpDir}/input.txt`);

    const actual = await read('<gitRoot>/tmp/read/input.txt');

    expect(actual).toEqual('something');
  });
});
