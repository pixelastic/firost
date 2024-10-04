import current from '../move.js';
import isFile from '../isFile.js';
import mkdirp from '../mkdirp.js';
import read from '../read.js';
import write from '../write.js';
import emptyDir from '../emptyDir.js';
import absolute from '../absolute.js';

describe('move', () => {
  const tmpDir = absolute('<gitRoot>/tmp/move');
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  describe('with a simple path', () => {
    it('should move a file to another one', async () => {
      await write('foo', `${tmpDir}/foo.txt`);

      await current(`${tmpDir}/foo.txt`, `${tmpDir}/bar.txt`);

      const actual = await isFile(`${tmpDir}/bar.txt`);
      expect(actual).toBe(true);
    });
    it('should move a file inside a directory, keeping the same name', async () => {
      await write('foo', `${tmpDir}/foo.txt`);
      await mkdirp(`${tmpDir}/folder`);

      await current(`${tmpDir}/foo.txt`, `${tmpDir}/folder`);

      const actual = await isFile(`${tmpDir}/folder/foo.txt`);
      expect(actual).toBe(true);
    });
    it('should move a directory inside a directory, recursively', async () => {
      await write('foo', `${tmpDir}/one/foo.txt`);
      await mkdirp(`${tmpDir}/two`);

      await current(`${tmpDir}/one`, `${tmpDir}/two`);

      const actual = await isFile(`${tmpDir}/two/one/foo.txt`);
      expect(actual).toBe(true);
    });
    it('should overwrite the destination file if it exists', async () => {
      await write('foo', `${tmpDir}/foo.txt`);
      await write('bar', `${tmpDir}/bar.txt`);

      await current(`${tmpDir}/foo.txt`, `${tmpDir}/bar.txt`);

      const actual = await read(`${tmpDir}/bar.txt`);
      expect(actual).toBe('foo');
    });
    it('should reject if trying to move a file that does not exist', async () => {
      let actual;

      try {
        await current(`${tmpDir}/foo.txt`, `${tmpDir}/bar.txt`);
      } catch (error) {
        actual = error;
      }

      expect(actual).toHaveProperty('code', 'ENOENT');
    });
    it('should reject if trying to move a directory to a file', async () => {
      await write('foo', `${tmpDir}/foo.txt`);
      await mkdirp(`${tmpDir}/folder`);

      let actual;

      try {
        await current(`${tmpDir}/folder`, `${tmpDir}/foo.txt`);
      } catch (error) {
        actual = error;
      }

      expect(actual).toHaveProperty(
        'code',
        'ERROR_CANNOT_OVERWRITE_FILE_WITH_DIRECTORY',
      );
    });
    it('should create nested directories if they do not exist', async () => {
      await write('foo', `${tmpDir}/foo.txt`);

      await current(`${tmpDir}/foo.txt`, `${tmpDir}/one/two/bar.txt`);

      const actual = await isFile(`${tmpDir}/one/two/bar.txt`);
      expect(actual).toBe(true);
    });
  });
  describe('with a glob pattern', () => {
    describe('no matches', () => {
      it('should reject', async () => {
        await mkdirp(`${tmpDir}/folder`);

        let actual;
        try {
          // Trying to move several files to one
          await current(`${tmpDir}/nope.*`, `${tmpDir}/folder`);
        } catch (error) {
          actual = error;
        }

        expect(actual).toHaveProperty('code', 'ERROR_GLOB_NO_MATCHES');
      });
    });
    describe('one match', () => {
      it('should do a regular move', async () => {
        await write('foo', `${tmpDir}/foo.txt`);
        await mkdirp(`${tmpDir}/folder`);

        await current(`${tmpDir}/*.txt`, `${tmpDir}/folder`);

        const actual = await isFile(`${tmpDir}/folder/foo.txt`);
        expect(actual).toBe(true);
      });
    });
    describe('several matches', () => {
      it('should reject if target is an existing file', async () => {
        await write('foo', `${tmpDir}/foo.txt`);
        await write('bar', `${tmpDir}/bar.txt`);
        await write('baz', `${tmpDir}/baz.txt`);

        let actual;
        try {
          await current(`${tmpDir}/b*.txt`, `${tmpDir}/foo.txt`);
        } catch (error) {
          actual = error;
        }

        expect(actual).toHaveProperty(
          'code',
          'ERROR_SAME_FILE_DESTINATION_FOR_SEVERAL_FILES',
        );
      });
      it('should move all matches to target directory', async () => {
        await write('foo', `${tmpDir}/foo.txt`);
        await write('bar', `${tmpDir}/bar.txt`);
        await write('baz', `${tmpDir}/baz.txt`);
        await mkdirp(`${tmpDir}/folder`);

        await current(`${tmpDir}/b*.txt`, `${tmpDir}/folder`);

        expect(await isFile(`${tmpDir}/folder/bar.txt`)).toBe(true);
        expect(await isFile(`${tmpDir}/folder/baz.txt`)).toBe(true);
      });
      it('should create target directory if does not exist', async () => {
        await write('foo', `${tmpDir}/foo.txt`);
        await write('bar', `${tmpDir}/bar.txt`);
        await write('baz', `${tmpDir}/baz.txt`);

        await current(`${tmpDir}/b*.txt`, `${tmpDir}/folder`);

        expect(await isFile(`${tmpDir}/folder/bar.txt`)).toBe(true);
        expect(await isFile(`${tmpDir}/folder/baz.txt`)).toBe(true);
      });
    });
  });
  describe('with an array of files', () => {
    describe('one file', () => {
      it('should do a regular copy', async () => {
        await write('foo', `${tmpDir}/foo.txt`);
        await mkdirp(`${tmpDir}/folder`);

        await current([`${tmpDir}/foo.txt`], `${tmpDir}/folder`);

        const actual = await isFile(`${tmpDir}/folder/foo.txt`);
        expect(actual).toBe(true);
      });
    });
    describe('several files', () => {
      it('should reject if target is an existing file', async () => {
        await write('foo', `${tmpDir}/foo.txt`);
        await write('bar', `${tmpDir}/bar.txt`);

        let actual;
        try {
          await current(
            [`${tmpDir}/foo.txt`, `${tmpDir}/bar.txt`],
            `${tmpDir}/foo.txt`,
          );
        } catch (error) {
          actual = error;
        }

        expect(actual).toHaveProperty(
          'code',
          'ERROR_SAME_FILE_DESTINATION_FOR_SEVERAL_FILES',
        );
      });
      it('should copy all matches to target directory', async () => {
        await write('foo', `${tmpDir}/foo.txt`);
        await write('bar', `${tmpDir}/bar.txt`);
        await mkdirp(`${tmpDir}/folder`);

        await current(
          [`${tmpDir}/foo.txt`, `${tmpDir}/bar.txt`],
          `${tmpDir}/folder`,
        );

        expect(await isFile(`${tmpDir}/folder/foo.txt`)).toBe(true);
        expect(await isFile(`${tmpDir}/folder/bar.txt`)).toBe(true);
      });
      it('should create target directory if does not exist', async () => {
        await write('foo', `${tmpDir}/foo.txt`);
        await write('bar', `${tmpDir}/bar.txt`);

        await current(
          [`${tmpDir}/foo.txt`, `${tmpDir}/bar.txt`],
          `${tmpDir}/folder`,
        );

        expect(await isFile(`${tmpDir}/folder/foo.txt`)).toBe(true);
        expect(await isFile(`${tmpDir}/folder/bar.txt`)).toBe(true);
      });
      it('should copy files and folders recursively', async () => {
        await write('foo', `${tmpDir}/one/foo.txt`);
        await write('bar', `${tmpDir}/two/bar.txt`);

        await current([`${tmpDir}/one`, `${tmpDir}/two`], `${tmpDir}/folder`);

        expect(await isFile(`${tmpDir}/folder/one/foo.txt`)).toBe(true);
        expect(await isFile(`${tmpDir}/folder/two/bar.txt`)).toBe(true);
      });
    });
  });
});
