import read from '../read.js';
import readSync from '../readSync.js';
import write from '../write.js';
import emptyDir from '../emptyDir.js';

describe('read', () => {
  const tmpDir = './tmp/read';
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  describe('reading files', () => {
    describe.each([['foo'], ['✓‽⛀']])('%s', (input) => {
      it('read', async () => {
        await write(input, `${tmpDir}/input.txt`);

        const actual = await read(`${tmpDir}/input.txt`);

        expect(actual).toEqual(input);
      });
      it('readSync', async () => {
        await write(input, `${tmpDir}/input.txt`);

        const actual = readSync(`${tmpDir}/input.txt`);

        expect(actual).toEqual(input);
      });
    });
  });
  describe('errors', () => {
    describe.each([
      [`${tmpDir}/file/that/does/not/exist.txt`, 'ENOENT'],
      [tmpDir, 'EISDIR'],
    ])('%s', (input, expected) => {
      it('read', async () => {
        let actual;
        try {
          await read(input);
        } catch (err) {
          actual = err;
        }
        expect(actual).toHaveProperty('code', expected);
      });
      it('readSync', async () => {
        let actual;
        try {
          readSync(input);
        } catch (err) {
          actual = err;
        }
        expect(actual).toHaveProperty('code', expected);
      });
    });
  });
});
